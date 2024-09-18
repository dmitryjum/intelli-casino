import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/nextauth";
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub();
const ACTIVE_GAMES_UPDATED = 'ACTIVE_GAMES_UPDATED';

export async function GET(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({
        error: "You must be logged in"
      }, { status: 401 });
    }

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    const openGames = await prisma.game.findMany({
      where: {
        status: "OPEN",
        openAt: {
          lte: oneMinuteAgo
        }
      }
    });

    if (openGames.length > 0) {
      const updatePromises = openGames.map(game => {
        return prisma.game.update({
          where: {
            id: game.id
          },
          data: {
            status: "CLOSED",
            openAt: null,
          },
        })
      })
      await Promise.all(updatePromises);

      const activeGames = await prisma.game.findMany({
        where: {
          status: {
            in: ["OPEN", "CLOSED"],
          },
        },
        orderBy: {
          openAt: "desc",
        },
      });

      pubsub.publish(ACTIVE_GAMES_UPDATED, {
        activeGamesUpdated: activeGames
      });

      return NextResponse.json(activeGames);
    }

    const activeGames = await prisma.game.findMany({
      where: {
        status: {
          in: ["OPEN", "CLOSED"],
        },
      },
      orderBy: {
        openAt: "desc",
      },
    });

    return NextResponse.json(activeGames);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Failed to fetch open games"
    }, { status: 500 });
  }
}