"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {}

const HistoryCard = (props: Props) => {
  const router = useRouter()
  return (
    <Card className="hover:cursor-pointer hover:opacity-75" onClick={() => {
      router.push("/history")
    }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Quiz History</CardTitle>
        <History className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">28</div>
        <p className="text-sm text-muted-foreground">Quizzes completed</p>
        <p className="text-sm text-muted-foreground">Click to view your past quiz attempts</p>
      </CardContent>
    </Card>
  )
}

export default HistoryCard