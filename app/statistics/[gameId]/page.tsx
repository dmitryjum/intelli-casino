import AccuracyCard from '@/components/statistics/AccuracyCard';
import QuestionList from '@/components/statistics/QuestionList';
import ResultsCard from '@/components/statistics/ResultsCard';
import TimeTakenCard from '@/components/statistics/TimeTakenCard';
import { buttonVariants } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { GameStatus } from '@prisma/client';
import { LucideLayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params: Promise<{
    gameId: string;
  }>
}

const StatisticsPage = async (props: Props) => {
  const params = await props.params;

  const {
    gameId
  } = params;

  const session = await getAuthSession()
  if (!session?.user) {
    return redirect
  }
  // TODO: SECURITY: MAKE SURE THIS ROUTE IS ONLY AVAILABLE FOR FINISHED GAME
  const game = await prisma.game.findUnique({
    where: {id: gameId},
    include: {
      quiz: {
        select: {
          gameType: true,
          questions: true
        }
      },
      userAnswers: true
    }
  });

  if (!game || game.status !== GameStatus.FINISHED) { return redirect("/quiz") }

  // logic to calculate user play results accuracy
  let accuracy: number = 0
  if (game.quiz.gameType === 'mcq') {
    let totalCorrect = game.userAnswers.reduce((acc, answer) => {
      if (answer.isCorrect) { return acc + 1 }
      return acc
    }, 0);
    accuracy = (totalCorrect / game.userAnswers.length) * 100;
  } else if (game.quiz.gameType === 'open_ended') {
    let totalPercentage = game.userAnswers.reduce((acc, answer) => {
      return acc + (answer.percentageCorrect || 0)
    }, 0);
    accuracy = totalPercentage / game.userAnswers.length
  }

  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <>
      <div className="px-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>
          <div className="flex items-center space-x-2">
            <Link href='/dashboard' className={buttonVariants()}>
              <LucideLayoutDashboard className='mr-2' />
              Back to Dashboard
            </Link>
          </div>
        </div>
        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy}/>
          <AccuracyCard accuracy={accuracy}/>
          <TimeTakenCard timeEnded={game.timeEnded} timeStarted={game.timeStarted} />
        </div>

        <QuestionList questions={game.quiz.questions} userAnswers={game.userAnswers}/>
      </div>
    </>
  )
}

export default StatisticsPage