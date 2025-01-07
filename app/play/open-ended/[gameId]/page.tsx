import OpenEnded from '@/components/OpenEnded';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: Promise<{
    gameId: string;
  }>
}

const OpenEndedPage = async (props: Props) => {
  const params = await props.params;

  const {
    gameId
  } = params;

  const session = await getAuthSession()
  if (!session?.user) {
    return redirect('/');
  }

  return <OpenEnded gameId={gameId} userId={session.user.id} />
}

export default OpenEndedPage