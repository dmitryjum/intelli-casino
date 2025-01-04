import OpenEnded from '@/components/OpenEnded';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    gameId: string;
  }
}

const OpenEndedPage = async ({params: {gameId}}: Props) => {
  const session = await getAuthSession()
  if (!session?.user) {
    return redirect('/');
  }


  return <OpenEnded gameId={gameId} userId={session.user.id} />
}

export default OpenEndedPage