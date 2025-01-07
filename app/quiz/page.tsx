import QuizCreation from '@/components/QuizCreation'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams: Promise<{
    topic?: string;
  }>
}

export const metadata = {
  title: "Quiz | Intelli Casino"
}

const QuizPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/')
  }
  return <QuizCreation topicParam={ searchParams.topic ?? ""}/>
}

export default QuizPage