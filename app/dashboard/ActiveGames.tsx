"use client"
import React from 'react'
import { useSubscription, useQuery} from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GET_ACTIVE_GAMES, GAME_UPDATED } from '@/app/api/graphql/operations'
import { GameData } from '../types/gameData'
import Link from 'next/link'
import { useUserContext } from '@/app/context/UserContext';
import { Role } from '@prisma/client'

type Props = {}

const ActiveGames = (props: Props) => {
  const { userRole, userId } = useUserContext();
  // Fetch initial active games using useQuery
  const { data, loading, error } = useQuery<{ activeGames: GameData['game'][] }>(GET_ACTIVE_GAMES, {
    fetchPolicy: 'cache-and-network',
  });
  
  const activeGames: GameData['game'][] = data?.activeGames || []
  // Subscribe to activeGamesUpdated using useSubscription
  useSubscription<{ gameUpdated: GameData['game'] }>(GAME_UPDATED, {
    variables: {},
    onData: ({ client, data }) => {
      if (!data) return;
      const updatedGame = data.data?.gameUpdated;
      if (!updatedGame) return;

      const gameIndex = activeGames.findIndex(gameData => gameData.id === updatedGame.id);
      // if the game is already in the active games list and the status isn't finished
      if (gameIndex > -1 && updatedGame.status !== 'FINISHED') {
        const updatedActiveGames = [...activeGames];
        // replace the game in the list and don't mutate it
        updatedActiveGames[gameIndex] = updatedGame;
        
        client.writeQuery({
          query: GET_ACTIVE_GAMES,
          data: {
            activeGames: updatedActiveGames,
          },
        });
      } else if (gameIndex > -1) { // if the game is in the active games list and it's finished
        if (gameIndex > -1) {
          client.writeQuery({
            query: GET_ACTIVE_GAMES,
            data: {
              // return all the active games except the current one
              activeGames: activeGames.filter(gameData => gameData.id !== updatedGame.id),
            },
          });
        }
      } else {
        // the gameIndex is -1, so it isn't in the list -> add the game
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
        {userRole === Role.PLAYER && (
          <div className="text-yellow-500 mb-4">
            You can&apos;t watch or play the games you haven&apos;t started. If you want to observe them, toggle your Role to a Spectator.
          </div>
        )}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Game Topic</th>
              <th className="px-4 py-2 text-left">State</th>
            </tr>
          </thead>
          <tbody>
            {activeGames.map((gameData) => (
              <tr key={gameData.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                  {userRole === Role.PLAYER && gameData.playerId !== userId ? (
                    <span className="text-gray-400">{gameData.quiz.topic}</span> // Dimmed text for PLAYER
                  ) : (
                    <Link href={`/play/${gameData.quiz.gameType.replace(/_/g, '-')}/${gameData.id}`} className="text-blue-500 hover:underline">
                      {gameData.quiz.topic}
                    </Link>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <span
                    className={
                      gameData.status === 'OPEN'
                        ? 'px-2 py-1 text-green-800 bg-green-200 rounded'
                        : 'px-2 py-1 text-yellow-800 bg-yellow-200 rounded'
                    }
                  >
                    {gameData.status}
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