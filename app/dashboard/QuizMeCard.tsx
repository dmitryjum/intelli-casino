'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BrainCircuit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {}

const QuizMeCard = (props: Props) => {
  const router = useRouter()
  return (
    <Card className="hover:cursor-pointer hover:opacity-75" onClick={() => {
      router.push("/quiz")
    }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Quiz Me</CardTitle>
        <BrainCircuit size={28} strokeWidth={2.5} />
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          Challenge yourself for a quiz!
        </p>
      </CardContent>
    </Card>
  )
}

export default QuizMeCard