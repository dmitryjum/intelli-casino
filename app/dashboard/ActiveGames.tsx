"use client"

import React from 'react'
import { useSubscription, useQuery} from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import Link from 'next/link'
import { GET_ACTIVE_GAMES, ACTIVE_GAMES_UPDATED } from '@/app/api/graphql/operations'


type Game = {
  id: string
  topic: string
  status: 'OPEN' | 'CLOSED'
  type: 'MCQ' | 'OPEN_ENDED'
  openAt: string
  timeStarted: string
  timeEnded: string
}

type Props = {}

const ActiveGames = (props: Props) => {
  // Fetch initial active games using useQuery
  const { data, loading, error } = useQuery<{ activeGames: Game[] }>(GET_ACTIVE_GAMES, {
    fetchPolicy: 'cache-and-network',
  });
  console.log("data after first fetch:", data);
  console.log("error:", error);

  // Subscribe to activeGamesUpdated using useSubscription
  useSubscription<{ activeGamesUpdated: Game[] }>(ACTIVE_GAMES_UPDATED, {
    onData: ({ client, data }) => {
      if (!data) return;
      console.log("data after subscription:", data);
      console.log("client:", client);
      const updatedGames = data;

      // Update the Apollo Client cache with the new active games
      client.writeQuery({
        query: GET_ACTIVE_GAMES,
        data: { activeGames: updatedGames },
      });
    },
  });
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  const activeGames = data?.activeGames || []

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
                  {/* <Link href={`/${game.type}/${game.id}`}> */}
                    <a className="text-blue-500 hover:underline">{game.topic}</a>
                  {/* </Link> */}
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