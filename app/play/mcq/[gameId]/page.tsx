import MCQ from '@/components/MCQ';
import { getAuthSession } from '@/lib/nextauth';
import { $Enums } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params: {
    gameId: string;
  }
}

const MCQPage = async ({params: {gameId}}: Props) => {
  const session = await getAuthSession()
  const isPlayer = session?.user?.playedGames.some(game => game.id === gameId);
  if (!session?.user || (session?.user.role === $Enums.Role.PLAYER && !isPlayer)) {
    return redirect('/');
  }

  return <MCQ gameId={gameId} />
}

export default MCQPage