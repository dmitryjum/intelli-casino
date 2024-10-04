import OpenEnded from '@/components/OpenEnded';
// import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react';
import { useQuery } from '@apollo/client';
import { Game, Question } from '@prisma/client';
import { GET_GAME } from '@/app/api/graphql/operations';

type Props = {
  params: {
    gameId: string;
  }
}

// type GameWithQuestions = Game & { questions: Pick<Question, 'id' | 'question' | 'answer'>[] };

const OpenEndedPage = async ({params: {gameId}}: Props) => {
  const session = await getAuthSession()
  if(!session?.user) {
    return redirect('/');
  }
  // const { data, loading, error } = useQuery<{ game: GameWithQuestions }>(GET_GAME, {
  //   variables: { gameId },
  //   fetchPolicy: 'cache-and-network',
  // });
  // const game: GameWithQuestions = {
  //   ...data?.game,
  //   questions: data?.game?.questions || []
  // }

  // const game = await prisma.game.findUnique({
  //   where: {
  //     id: gameId
  //   },
  //   include: {
  //     questions: {
  //       select: {
  //         id: true,
  //         question: true,
  //         options: true,
  //         answer: true
  //       }
  //     }
  //   }
  // });

  // if (loading) return <div>Loading...</div>
  // if (error) return <div>Error: {error.message}</div>

  // if (!game || game.gameType !== 'open_ended') {
  //   return redirect('/quiz')
  // }
  return <OpenEnded gameId={gameId} />
}

export default OpenEndedPage