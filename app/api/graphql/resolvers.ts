import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions'
import { IResolvers } from '@graphql-tools/utils';

const pubsub = new PubSub();
const prisma = new PrismaClient();
const ACTIVE_GAMES_UPDATED = 'ACTIVE_GAMES_UPDATED';

const resolvers: IResolvers = {
  Query: {
    activeGames: async () => {
      return await prisma.game.findMany({
        where: {
          status: {
            in: ['OPEN', 'CLOSED'],
          },
        },
        orderBy: {
          openAt: 'desc',
        },
      });
    },
    game: async (_: any, { id }: { id: string }) => {
      return prisma.game.findUnique({ where: { id } });
    },
  },
  Mutation: {
    openGame: async (_: any, { gameId }: { gameId: string }) => {
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          status: 'OPEN',
          openAt: new Date()
        },
      });

      // fetch updated active games
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

      // publish to pubsub
      pubsub.publish(ACTIVE_GAMES_UPDATED, { activeGamesUpdated: activeGames });

      return updatedGame;
    },
    closeGame: async (_: any, { gameId }: { gameId: string }) => {
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          status: 'CLOSED',
          openAt: null,
        },
      });

      // fetch updated active games
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

      // publish to pubsub
      pubsub.publish(ACTIVE_GAMES_UPDATED, { activeGamesUpdated: activeGames });

      return updatedGame;
    },
    finishGame: async (_: any, { gameId }: { gameId: string }) => {
      const updatedGame = await prisma.game.update({
        where: {id: gameId},
        data: {
          status: 'FINISHED',
          openAt: null,
        },
      })

      // fetch updated active games (exclude FINISHED)
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

      // publish to pubsub
      pubsub.publish(ACTIVE_GAMES_UPDATED, { activeGamesUpdated: activeGames });

      return updatedGame;
    },
  },
  Subscription: {
    activeGamesUpdated: {
      subscribe: () => pubsub.asyncIterator(ACTIVE_GAMES_UPDATED),
    },
  },
}

export default resolvers ;