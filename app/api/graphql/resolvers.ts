import { prisma } from '@/lib/db'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub();
const ACTIVE_GAMES_UPDATED = 'ACTIVE_GAMES_UPDATED';

const resolvers = {
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