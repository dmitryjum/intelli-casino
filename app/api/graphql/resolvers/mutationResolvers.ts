import { GameType, PrismaClient, Role } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions'
import { OPEN_DURATION } from '@/lib/constants';
import { generateBlankedAnswer } from '@/lib/utils';
import { GraphQLError } from 'graphql';
const pubsub = new PubSub();
const prisma = new PrismaClient();
const GAME_UPDATED = 'GAME_UPDATED';

export const mutationResolvers = {
    openGame: async (_: any, { gameId, currentQuestionIndex }:
    { gameId: string, currentQuestionIndex?: number }, context: any) => {
      const { session } = context;
      const updatedGame = await prisma.$transaction(async (prisma) => {
        const game = await prisma.game.findUnique({
          where: { id: gameId },
          select: {
            playerId: true,
          }
        });
  
        if (!game || (game.playerId !== session.user.id && session.user.role !== Role.PLAYER)) {
          throw new GraphQLError('You are not authorized to open this game', {
            extensions: {
              code: 'UNAUTHORIZED',
              http: { status: 403 },
            }
          });
        }
  
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
        return await prisma.game.update({
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
      });

      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    closeGame: async (_: any, { gameId, currentQuestionIndex }:
    { gameId: string, currentQuestionIndex?: number }, context: any) => {
      const { session } = context;
      const updatedGame = await prisma.$transaction(async (prisma) => {
        const game = await prisma.game.findUnique({
          where: { id: gameId },
          include: {
            spectators: {
              select: {
                id: true
              }
            }
          }
        });

        if (game) {
          const isSpectator = game.spectators.some(spectator => spectator.id === session.user.id);
          if (game.playerId !== session.user.id && !isSpectator) {
            throw new GraphQLError('You are not authorized to close this game', {
              extensions: {
                code: 'UNAUTHORIZED',
                http: { status: 403 },
              }
            });
          }

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
          const updatedTransactionGame = await prisma.game.update({
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
          if (updatedTransactionGame.quiz.gameType === GameType.open_ended) {
            const currentQuestion = updatedTransactionGame.quiz.questions[updatedTransactionGame.currentQuestionIndex];
            const blankedAnswer = generateBlankedAnswer(currentQuestion.answer);
            await prisma.question.update({
              where: {id: currentQuestion.id },
              data: { blankedAnswer },
            });
            currentQuestion.blankedAnswer = blankedAnswer;
          }
          return updatedTransactionGame;
        } else {
          throw new GraphQLError('Game not found', {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 },
            }
          });
        }
      });

      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    finishGame: async (_: any, { gameId, timeEnded }: {gameId: string, timeEnded: string}, context: any) => {
      const { session } = context;
      const updatedGame = await prisma.$transaction(async (prisma) => {
        const game = await prisma.game.findUnique({
          where: { id: gameId },
          include: {
            spectators: {
              select: {
                id: true
              }
            }
          }
        });

        if (game) {
          const isSpectator = game.spectators.some(spectator => spectator.id === session.user.id);
          if (game.playerId !== session.user.id && !isSpectator) {
            throw new GraphQLError('You are not authorized to finish this game', {
              extensions: {
                code: 'UNAUTHORIZED',
                http: { status: 403 },
              }
            });
          }
          return await prisma.game.update({
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
        } else {
          throw new GraphQLError('Game not found', {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 },
            }
          });
        }
      });

      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    updateGameQuestion: async (_: any, { gameId, currentQuestionStartTime, currentQuestionIndex }: { gameId: string, currentQuestionStartTime: string, currentQuestionIndex: number }, context: any) => {
      const { session } = context;
      const updatedGame = await prisma.$transaction(async (prisma) => {
        const game = await prisma.game.findUnique({
          where: { id: gameId },
          include: {
            spectators: {
              select: {
                id: true
              }
            }
          }
        });

        if (game) {
          const isSpectator = game.spectators.some(spectator => spectator.id === session.user.id);
          if (game.playerId !== session.user.id && !isSpectator) {
            throw new GraphQLError('You are not authorized to update this game question', {
              extensions: {
                code: 'UNAUTHORIZED',
                http: { status: 403 },
              }
            });
          }

          let updatedTransactionGame = await prisma.game.update({
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
          if (updatedTransactionGame.quiz.gameType === GameType.open_ended) {
            const currentQuestion = updatedTransactionGame.quiz.questions[currentQuestionIndex];
            const blankedAnswer = generateBlankedAnswer(currentQuestion.answer);
            await prisma.question.update({
              where: { id: currentQuestion.id },
              data: { blankedAnswer },
            });
            currentQuestion.blankedAnswer = blankedAnswer;
          }
          return updatedTransactionGame;
        } else {
          throw new GraphQLError('Game not found', {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 },
            }
          });
        }
      });

      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    addSpectatorToGame: async(_: any, { gameId, userId }: { gameId: string, userId: string }, context: any) => {
      const { session } = context;
      const updatedGame = await prisma.$transaction(async (prisma) => {
        const game = await prisma.game.findUnique({
          where: { id: gameId },
          include: {
            spectators: {
              select: {
                id: true
              }
            }
          }
        });

        if (game) {
          if (game.playerId == session.user.id || session.user.role === Role.PLAYER ) {
            throw new GraphQLError('You are not authorized to add this spectator to this game', {
              extensions: {
                code: 'UNAUTHORIZED',
                http: { status: 403 },
              }
            });
          }

          const updatedTransactionGame = await prisma.game.update({
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

          if (updatedTransactionGame?.quiz && updatedTransactionGame?.quiz?.questions) {
            updatedTransactionGame.quiz.questions = updatedTransactionGame.quiz.questions.slice(0, updatedTransactionGame.currentQuestionIndex + 1);
          } else {
            throw new GraphQLError('Invalid quiz or questions data in game', {
              extensions: {
                code: 'INVALID_GAME_DATA',
                http: { status: 400 },
              }
            });
          }
          return updatedTransactionGame;
        } else {
          throw new GraphQLError('Game not found', {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 },
            }
          });
        }
      });
        
      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });
      return updatedGame
    }
  }