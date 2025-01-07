import MCQ from '@/components/MCQ';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params: Promise<{
    gameId: string;
  }>
}

const MCQPage = async (props: Props) => {
  const params = await props.params;

  const {
    gameId
  } = params;

  const session = await getAuthSession()
  if (!session?.user) {
    return redirect('/');
  }

  return <MCQ gameId={gameId} userId={session.user.id} />
}

export default MCQPage