import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Brain, History, Zap, Trophy, Users, TrendingUp } from 'lucide-react'

export default function NewDashboardClient() {
  // Placeholder data - replace with actual data fetching logic
  const activeGames = [
    { id: 1, topic: "Quantum Physics", status: "OPEN", players: 4, totalPlayers: 6 },
    { id: 2, topic: "World History", status: "CLOSED", players: 6, totalPlayers: 6 },
    { id: 3, topic: "Mathematical Puzzles", status: "OPEN", players: 2, totalPlayers: 8 },
  ]

  return (
    <div className="p-8 mx-auto max-w-7xl">
      {/* <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Intellectual Casino</h1>
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
          <AvatarFallback>IC</AvatarFallback>
        </Avatar>
      </div> */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Quick Challenge</CardTitle>
            <Brain className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Test your knowledge with a quick quiz!</p>
            <Button className="w-full">Start Quiz</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Quiz History</CardTitle>
            <History className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-sm text-muted-foreground">Quizzes completed</p>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Your Rank</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">#42</div>
            <p className="text-sm text-muted-foreground">Global ranking</p>
            <Badge className="mt-3" variant="secondary">Top 10%</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Active Games</CardTitle>
              <Badge variant="outline" className="text-sm">
                {activeGames.length} Games
              </Badge>
            </div>
            <CardDescription>Join or spectate ongoing intellectual battles</CardDescription>
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
                      <h3 className="font-semibold">{game.topic}</h3>
                      <p className="text-sm text-muted-foreground">
                        {game.players}/{game.totalPlayers} players
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={game.status === "OPEN" ? "success" : "warning"}>
                      {game.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {game.status === "OPEN" ? "Join" : "Spectate"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Total Players Online</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-sm text-muted-foreground">Active intellectuals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Trending Topic</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Quantum Computing</div>
            <p className="text-sm text-muted-foreground">Hot topic of the day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Your Winnings</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Ξ 5.43</div>
            <p className="text-sm text-muted-foreground">Total ETH earned</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}