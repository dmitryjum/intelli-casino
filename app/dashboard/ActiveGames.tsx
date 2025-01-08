"use client"
import React from 'react'
import { useSubscription, useQuery } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GET_ACTIVE_GAMES, GAME_UPDATED } from '@/app/api/graphql/operations'
import { GameData } from '../types/gameData'
import Link from 'next/link'
import { useUserContext } from '@/app/context/UserContext';
import { Role } from '@prisma/client'
import { Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type Props = {}

const ActiveGames = (props: Props) => {
  const { userRole, userId } = useUserContext();
  const router = useRouter()
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Active Games</CardTitle>
          <CardDescription>No games are currently active.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You can start a new game. {userRole === Role.SPECTATOR && "Toggle your role to a Player"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Active Games</CardTitle>
          <Badge variant="outline" className="text-sm">
            {activeGames.length} Games
          </Badge>
        </div>
        <CardDescription>
          Join or spectate ongoing intellectual battles
          {userRole === Role.PLAYER && (
            <span className="text-yellow-500 mb-4 block">
              You can&apos;t watch or play the games you haven&apos;t started. If you want to observe them, toggle your Role to a Spectator.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeGames.map((game) => (
            
            <div key={game.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary rounded-full">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  {userRole === Role.PLAYER && game.playerId !== userId ? (
                    <h3 className="font-semibold text-gray-400">{game.quiz.topic}</h3> // Dimmed text for PLAYER
                  ) : (
                    <h3 className="font-semibold">
                      <Link href={`/play/${game.quiz.gameType.replace(/_/g, '-')}/${game.id}`} className="text-blue-500 hover:underline">
                        {game.quiz.topic}
                      </Link>
                    </h3>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {game.spectators.length} spectators
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={game.status === "OPEN" ? "outline" : "secondary"} className={
                  game.status === 'OPEN' ? 'bg-green-200' : 'text-yellow-800'
                }>
                    {game.status}
                </Badge>
                {(userRole === Role.PLAYER && game.playerId === userId || userRole === Role.SPECTATOR && game.playerId !== userId) &&
                <Button variant="outline" size="sm" onClick={() => {
                    router.push(`/play/${game.quiz.gameType.replace(/_/g, '-')}/${game.id}`)
                }}>
                  {userRole === Role.PLAYER ? "Join" : "Spectate"}
                </Button>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ActiveGames