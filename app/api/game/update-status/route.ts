import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { PubSub } from 'graphql-subscriptions'
import { getAuthSession } from "@/lib/nextauth";

const pubsub = new PubSub()
const ACTIVE_GAMES_UPDATED = 'ACTIVE_GAMES_UPDATED';

const updateStatusSchema = z.object({
  gameId: z.string(),
  status: z.enum(['OPEN', 'CLOSED', 'FINISHED']),
})

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({
        error: "You must be logged in"
      }, { status: 401 });
    }

    const body = await request.json()
    const { gameId, status } = updateStatusSchema.parse(body)

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        status,
        openAt: status === 'OPEN' ? new Date() : null,
      },
    })

    // Fetch updated active games (only OPEN and CLOSED)
    const activeGames = await prisma.game.findMany({
      where: {
        status: {
          in: ['OPEN', 'CLOSED'],
        },
      },
      orderBy: {
        openAt: 'desc',
      },
    })

    // Publish the updated active games
    pubsub.publish(ACTIVE_GAMES_UPDATED, { activeGamesUpdated: activeGames })

    return NextResponse.json(updatedGame)
  } catch (error) {
    console.error('Error updating game status:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update game status' }, { status: 500 })
  }
}