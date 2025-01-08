import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, TrendingUp } from 'lucide-react'
import StartQuizCard from './StartQuizCard'
import ActiveGames from './ActiveGames'
import HistoryCard from './HistoryCard'
import CustomWordCloud from '@/components/CustomWordCloud'

type Props = {
  userRank: number,
  trendingTopic: string | undefined,
  userCount: number,
  topics: {
    text: string,
    value: number,
  }[]
}

const DashboardClient = (props: Props) => {
  return (
    <div className="p-8 mx-auto max-w-7xl">

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StartQuizCard />
        <HistoryCard />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Your Rank</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          
          <CardContent>
            <div className="text-3xl font-bold">#{props.userRank}</div>
            {props.userRank < 1 ? (
              <p className="text-sm text-muted-foreground">Play a game to improve your rank</p>
            ) : (
              <p className="text-sm text-muted-foreground">Global ranking</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <ActiveGames />
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
            <CardDescription>
              Click on a topic to start a quiz on it! Toggle your role to a Player if you are Spectator
            </CardDescription>
          </CardHeader>

          <CardContent className='pl-2 [&_text]:cursor-pointer'>
            <CustomWordCloud formattedTopics={props.topics} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Total Players and Spectators</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{props.userCount}</div>
            <p className="text-sm text-muted-foreground">Active intellectuals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Trending Topic</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
            {props.trendingTopic ? (
            <CardContent>
              <div className="text-2xl font-bold">{props.trendingTopic}</div>
              <p className="text-sm text-muted-foreground">Hot topic of the day</p>
            </CardContent>
            ) : (
              <CardContent>Play a new game to set the trend</CardContent>
            )}
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

export default DashboardClient