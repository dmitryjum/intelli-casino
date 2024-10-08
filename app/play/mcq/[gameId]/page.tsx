import MCQ from '@/components/MCQ';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params: {
    gameId: string;
  }
}

const MCQPage = async ({params: {gameId}}: Props) => {
  const session = await getAuthSession()
  if(!session?.user) {
    return redirect('/');
  }

  return <MCQ gameId={gameId} />
}

export default MCQPage