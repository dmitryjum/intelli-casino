import { PrismaClient } from '@prisma/client';
import { PubSub, withFilter } from 'graphql-subscriptions'
import { IResolvers } from '@graphql-tools/utils';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-scalars';
import { OPEN_DURATION } from '@/lib/constants';
import { generateBlankedAnswer } from '@/lib/utils';
import { GraphQLError } from 'graphql';

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
        include: {
          quiz: {
            select: {
              id: true,
              topic: true,
              gameType: true,
            },
          }
        }
      });
      
      return activeGames;
    },
    game: async (_: any, { gameId }: { gameId: string }) => {
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
          spectators: {
            select: {
              id: true
            }
          },
          quiz: {
            select: {
              id: true,
              topic: true,
              gameType: true,
              _count: { select: { questions: true } },
              questions: {
                select: {
                  id: true,
                  question: true,
                  options: true,
                  answer: true,
                  blankedAnswer: true,
                },
                orderBy: {
                  id: 'asc'
                },
              },
            },
          },
          userAnswers: {
            select: {
              id: true,
              questionId: true,
              answer: true,
              userId: true,
            },
          },
        }
      });

      if (game?.quiz && game?.quiz?.questions) {
        game.quiz.questions = game.quiz.questions.slice(0, game.currentQuestionIndex + 1);
      } else {
        throw new GraphQLError('Invalid quiz or questions data in game', {
          extensions: {
            code: 'INVALID_GAME_DATA',
            http: { status: 400 },
          }
        });
      }
      return game;
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
      } else {
        updatedData.currentQuestionIndex = 0;
      }
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: updatedData,
        include: {
          spectators: {
            select: {
              id: true
            }
          },
          quiz: {
            select: {
              id: true,
              topic: true,
              gameType: true,
              _count: { select: { questions: true } },
              questions: {
                select: {
                  id: true,
                  question: true,
                  options: true,
                  answer: true,
                  blankedAnswer: true,
                },
                orderBy: {
                  id: 'asc'
                },
                take: updatedData.currentQuestionIndex + 1
              },
            },
          },
          userAnswers: {
            select: {
              id: true,
              questionId: true,
              answer: true,
              userId: true,
            },
          },
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
      } else {
        updatedData.currentQuestionIndex = 0;
      }
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: updatedData,
        include: {
          spectators: {
            select: {
              id: true
            }
          },
          quiz: {
            select: {
              id: true,
              topic: true,
              gameType: true,
              _count: { select: { questions: true } },
              questions: {
                select: {
                  id: true,
                  question: true,
                  options: true,
                  answer: true,
                  blankedAnswer: true,
                },
                orderBy: {
                  id: 'asc'
                },
                take: updatedData.currentQuestionIndex + 1
              },
            },
          },
          userAnswers: {
            select: {
              id: true,
              questionId: true,
              answer: true,
              userId: true,
            },
          },
        }
      });
      const currentQuestion = updatedGame.quiz.questions[updatedGame.currentQuestionIndex];
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
          spectators: {
            select: {
              id: true
            }
          },
          quiz: {
            select: {
              id: true,
              topic: true,
              gameType: true,
              _count: { select: { questions: true } },
              questions: {
                select: {
                  id: true,
                  question: true,
                  options: true,
                  answer: true,
                  blankedAnswer: true,
                },
                orderBy: {
                  id: 'asc'
                },
              },
            },
          },
          userAnswers: {
            select: {
              id: true,
              questionId: true,
              answer: true,
              userId: true,
            },
          },
        }
      });

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
          spectators: {
            select: {
              id: true
            }
          },
          quiz: {
            select: {
              id: true,
              topic: true,
              gameType: true,
              _count: { select: { questions: true } },
              questions: {
                select: {
                  id: true,
                  question: true,
                  options: true,
                  answer: true,
                  blankedAnswer: true,
                },
                orderBy: {
                  id: 'asc'
                },
                take: currentQuestionIndex + 1
              },
            },
          },
          userAnswers: {
            select: {
              id: true,
              questionId: true,
              answer: true,
              userId: true,
            },
          },
        }
      });

      const currentQuestion = updatedGame.quiz.questions[currentQuestionIndex];
      const blankedAnswer = generateBlankedAnswer(currentQuestion.answer);
      await prisma.question.update({
        where: { id: currentQuestion.id },
        data: { blankedAnswer },
      });
      currentQuestion.blankedAnswer = blankedAnswer;

      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    addSpectatorToGame: async(_: any, { gameId, userId }: { gameId: string, userId: string }) => {
      try {
        const updatedGame = await prisma.game.update({
          where: { id: gameId },
          data: {
            spectators: {
              connect: { id: userId },
            }
          },
          include: {
            spectators: {
              select: {
                id: true
              }
            },
            quiz: {
              select: {
                id: true,
                topic: true,
                gameType: true,
                _count: { select: { questions: true } },
                questions: {
                  select: {
                    id: true,
                    question: true,
                    options: true,
                    answer: true,
                    blankedAnswer: true,
                  },
                  orderBy: {
                    id: 'asc'
                  }
                },
              },
            },
            userAnswers: {
              select: {
                id: true,
                questionId: true,
                answer: true,
                userId: true,
              },
            },
          }
        });

        if (updatedGame?.quiz && updatedGame?.quiz?.questions) {
          updatedGame.quiz.questions = updatedGame.quiz.questions.slice(0, updatedGame.currentQuestionIndex + 1);
        } else {
          throw new GraphQLError('Invalid quiz or questions data in game', {
            extensions: {
              code: 'INVALID_GAME_DATA',
              http: { status: 400 },
            }
          });
        }

        pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });
        return updatedGame
      } catch (error) {
        console.error("Error adding spectator to game: ", error);
        throw new Error("Failed to add a spectator");
      }
    }
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