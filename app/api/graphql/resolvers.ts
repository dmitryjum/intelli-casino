import { PrismaClient } from '@prisma/client';
import { PubSub, withFilter } from 'graphql-subscriptions'
import { IResolvers } from '@graphql-tools/utils';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-scalars';
import { OPEN_DURATION } from '@/lib/constants';
import { generateBlankedAnswer } from '@/lib/utils';

const pubsub = new PubSub();
const prisma = new PrismaClient();
const GAME_UPDATED = 'GAME_UPDATED';

const resolvers: IResolvers = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,

  Query: {
    activeGames: async () => {
      const activeGames = await prisma.game.findMany({
        where: {
          status: {
            in: ['OPEN', 'CLOSED'],
          },
        },
        orderBy: {
          openAt: 'desc',
        },
      });
      console.log("activeGames Resolver:", activeGames);
      return activeGames;
    },
    game: async (_: any, { gameId }: { gameId: string }) => {
      return prisma.game.findUnique({
        where: { id: gameId },
        include: {
          questions: {
            select: {
              id: true,
              question: true,
              options: true,
              answer: true,
              userAnswer: true,
              blankedAnswer: true
            },
            orderBy: {
              id: 'asc'
            }
          }
        }
      });
    },
  },
  Mutation: {
    openGame: async (_: any, { gameId, currentQuestionIndex }:
    { gameId: string, currentQuestionIndex?: number }) => {
      
      let updatedData: any = {
        status: 'OPEN',
        openAt: new Date(),
      }

      if (currentQuestionIndex !== undefined) {
        updatedData.currentQuestionIndex = currentQuestionIndex;
        updatedData.currentQuestionStartTime = new Date(new Date(updatedData.openAt).getTime() + OPEN_DURATION * 1000)
      }
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: updatedData,
        include: {
          questions: {
            select: {
              id: true,
              question: true,
              options: true,
              answer: true,
              blankedAnswer: true
            }
          }
        }
      });

      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    closeGame: async (_: any, { gameId, currentQuestionIndex }:
    { gameId: string, currentQuestionIndex?: number }) => {
      let updatedData: any = {
        status: 'CLOSED',
        openAt: null,
      }

      if (currentQuestionIndex !== undefined) {
        updatedData.currentQuestionIndex = currentQuestionIndex;
        updatedData.currentQuestionStartTime = new Date()
      }
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: updatedData,
        include: {
          questions: {
            select: {
              id: true,
              question: true,
              options: true,
              answer: true,
              userAnswer: true,
              blankedAnswer: true
            },
            orderBy: {
              id: 'asc'
            }
          }
        }
      });
      const currentQuestion = updatedGame.questions[updatedGame.currentQuestionIndex];
      const blankedAnswer = generateBlankedAnswer(currentQuestion.answer);
      await prisma.question.update({
        where: {id: currentQuestion.id },
        data: { blankedAnswer },
      });
      currentQuestion.blankedAnswer = blankedAnswer;

      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    finishGame: async (_: any, { gameId, timeEnded }: {gameId: string, timeEnded: string}) => {
      const updatedGame = await prisma.game.update({
        where: {id: gameId},
        data: {
          status: 'FINISHED',
          openAt: null,
          timeEnded: timeEnded,
          currentQuestionStartTime: null
        },
        include: {
          questions: {
            select: {
              id: true,
              question: true,
              options: true,
              answer: true,
              userAnswer: true,
              blankedAnswer: true
            }
          }
        }
      })

      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    updateGameQuestion: async (_: any, { gameId, currentQuestionStartTime, currentQuestionIndex }: { gameId: string, currentQuestionStartTime: string, currentQuestionIndex: number }) => {
      let updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          currentQuestionIndex: currentQuestionIndex,
          currentQuestionStartTime: new Date(currentQuestionStartTime),
        },
        include: {
          questions: {
            select: {
              id: true,
              question: true,
              options: true,
              answer: true,
              userAnswer: true,
              blankedAnswer: true
            },
            orderBy: {
              id: 'asc'
            }
          }
        }
      });

      const currentQuestion = updatedGame.questions[currentQuestionIndex];
      const blankedAnswer = generateBlankedAnswer(currentQuestion.answer);
      await prisma.question.update({
        where: { id: currentQuestion.id },
        data: { blankedAnswer },
      });
      currentQuestion.blankedAnswer = blankedAnswer;

      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
  },
  Subscription: {
    gameUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GAME_UPDATED),
        (payload, variables) => {
          if (variables.gameId) {
            return payload.gameUpdated.id === variables.gameId;
          }
          return true; // If no gameId provided, send all updates
        }
      ),
    },
  },
}

export default resolvers ;