import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

export const queryResolvers = {
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
  };