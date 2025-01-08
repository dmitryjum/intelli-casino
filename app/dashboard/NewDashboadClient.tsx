import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, History, Zap, Trophy, Users, TrendingUp } from 'lucide-react'
import HistoryComponent from '@/components/HistoryComponent'
import HotTopicsCard from './HotTopicsCard'
import StartQuizCard from './StartQuizCard'
import ActiveGames from './ActiveGames'

export default async function NewDashboardClient() {
  return (
    <div className="p-8 mx-auto max-w-7xl">

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StartQuizCard />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Quiz History</CardTitle>
            <History className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-sm text-muted-foreground">Quizzes completed</p>
            {/* <Progress value={75} className="mt-3" /> */}
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
            {/* <Badge className="mt-3" variant="secondary">Top 10%</Badge> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <ActiveGames />
        <HotTopicsCard />
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
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Your Winnings</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Ξ 5.43</div>
            <p className="text-sm text-muted-foreground">Total ETH earned</p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}