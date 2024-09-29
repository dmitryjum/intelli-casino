"use client"
import { Game } from '@prisma/client'
import React from 'react'
import { useSubscription, useQuery} from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GET_ACTIVE_GAMES, GAME_UPDATED } from '@/app/api/graphql/operations'
import Link from 'next/link'

type Props = {}

const ActiveGames = (props: Props) => {
  // Fetch initial active games using useQuery
  const { data, loading, error } = useQuery<{ activeGames: Game[] }>(GET_ACTIVE_GAMES, {
    fetchPolicy: 'cache-and-network',
  });
  const activeGames: Game[] = data?.activeGames || []

  // Subscribe to activeGamesUpdated using useSubscription
  useSubscription<{ gameUpdated: Game }>(GAME_UPDATED, {
    variables: {},
    onData: ({ client, data }) => {
      if (!data) return;
      const updatedGame = data.data?.gameUpdated;
      if (!updatedGame) return;
      const gameIndex = activeGames.findIndex(game => game.id === updatedGame.id);

      if (gameIndex > -1 && updatedGame.status !== 'FINISHED') {
        const updatedActiveGames = [...activeGames];
        updatedActiveGames[gameIndex] = updatedGame;
        
        client.writeQuery({
          query: GET_ACTIVE_GAMES,
          data: {
            activeGames: updatedActiveGames,
          },
        });
      } else if (gameIndex > -1) {
        if (gameIndex > -1) {
          client.writeQuery({
            query: GET_ACTIVE_GAMES,
            data: {
              activeGames: activeGames.filter(game => game.id !== updatedGame.id),
            },
          });
        }
      } else {
        client.writeQuery({
          query: GET_ACTIVE_GAMES,
          data: {
            activeGames: [...activeGames, updatedGame],
          },
        });
      }
    },
  });
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  if (activeGames.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Active Games</CardTitle>
          <CardDescription>No games are currently active.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>None of the games are active!</p>
          <p>You can start a new game.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Active Games</CardTitle>
        <CardDescription>Games in the OPEN or CLOSED state.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Game Topic</th>
              <th className="px-4 py-2 text-left">State</th>
            </tr>
          </thead>
          <tbody>
            {activeGames.map((game) => (
              <tr key={game.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                  <Link href={`/play/${game.gameType.replace(/_/g, '-')}/${game.id}`} className="text-blue-500 hover:underline">
                    {game.topic}
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  <span
                    className={
                      game.status === 'OPEN'
                        ? 'px-2 py-1 text-green-800 bg-green-200 rounded'
                        : 'px-2 py-1 text-yellow-800 bg-yellow-200 rounded'
                    }
                  >
                    {game.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default ActiveGames