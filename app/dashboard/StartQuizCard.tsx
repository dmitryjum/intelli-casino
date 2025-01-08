'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useUserContext } from '@/app/context/UserContext'
import { Role } from '@prisma/client';
import { Button } from '@/components/ui/button'

type Props = {}

const StartQuizCard = (props: Props) => {
  const router = useRouter()
  const { userRole } = useUserContext();
  if (userRole === Role.PLAYER) {
    return (
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Quick Challenge</CardTitle>
          <Brain className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Test your knowledge with a quick quiz!</p>
          <Button className="w-full" onClick={() => { router.push("/quiz") }}>Start Quiz</Button>
        </CardContent>
      </Card>
    )
  }
}

export default StartQuizCard