import { PrismaClient } from '@prisma/client';
import { PubSub, withFilter } from 'graphql-subscriptions'
import { IResolvers } from '@graphql-tools/utils';

const pubsub = new PubSub();
const prisma = new PrismaClient();
const GAME_UPDATED = 'GAME_UPDATED';

const resolvers: IResolvers = {
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
      console.log("activeGames:", activeGames);
      return activeGames;
    },
    game: async (_: any, { id }: { id: string }) => {
      return prisma.game.findUnique({ where: { id } });
    },
  },
  Mutation: {
    openGame: async (_: any, args:
    { gameId: string, currentQuestionStartTime?: string, currentQuestionIndex?: number }) => {
      console.log("OPEN GAME MUTATION: ", args);
      let updatedData: any = {
        status: 'OPEN',
        openAt: new Date().toISOString(),
      }

      if (args.currentQuestionStartTime) updatedData.currentQuestionStartTime = new Date(args.currentQuestionStartTime);

      if (args.currentQuestionIndex) updatedData.currentQuestionIndex = args.currentQuestionIndex;
      const updatedGame = await prisma.game.update({
        where: { id: args.gameId },
        data: updatedData,
      });

      // publish to pubsub
      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    closeGame: async (_: any, { gameId, currentQuestionStartTime, currentQuestionIndex }:
    { gameId: string, currentQuestionStartTime?: string, currentQuestionIndex?: number }) => {
      let updatedData: any = {
        status: 'CLOSED',
        openAt: null,
      }

      if (currentQuestionStartTime) updatedData.currentQuestionStartTime = new Date(currentQuestionStartTime);

      if (currentQuestionIndex) updatedData.currentQuestionIndex = currentQuestionIndex;
      console.log("CLOSE GAME MUTATION: ", updatedData);
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: updatedData,
      });


      // publish to pubsub
      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    finishGame: async (_: any, { gameId, timeEnded }: {gameId: string, timeEnded: string}) => {
      const updatedGame = await prisma.game.update({
        where: {id: gameId},
        data: {
          status: 'FINISHED',
          openAt: null,
          timeEnded: timeEnded
        },
      })

      // publish to pubsub
      pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });

      return updatedGame;
    },
    updateGameQuestion: async (_: any, { gameId, currentQuestionStartTime, currentQuestionIndex }: { gameId: string, currentQuestionStartTime: string, currentQuestionIndex: number }) => {
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          currentQuestionIndex: currentQuestionIndex,
          currentQuestionStartTime: new Date(currentQuestionStartTime),
        },
      });

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