'use client';
import { formatTimeDelta } from '@/lib/utils';
import { GameStatus, GameType, Role } from '@prisma/client'
import { ChevronRight, Loader2, Timer } from 'lucide-react';
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import axios from 'axios';
import BlankAnswerInput from './BlankAnswerInput';
import { useUserContext } from '@/app/context/UserContext';
import StartTimer from './StartTimer';
import { QUESTION_DURATION } from '@/lib/constants';
import { useGames } from '@/app/hooks/useGames';
import GameOpenView from './GameOpenView';
import GameEndedView from './GameEndedView';
import { useRouter } from 'next/navigation';

type Props = {
  gameId: string,
  userId: string
};

const OpenEnded = ({ gameId, userId }: Props) => {
  const router = useRouter();
  const { userRole } = useUserContext();
  const { game, loading, error, closeGame, finishGame, updateGameQuestion, addSpectatorToGame } = useGames({ gameId, userRole });
  const {toast} = useToast();
  const isSpectator = game.spectators.some(spectator => spectator.id === userId);

  React.useEffect(() => {
    // if the user-Player tries to open a game that he's not a player of
    if (userRole === Role.PLAYER && game.playerId !== userId && !loading && !error) {
      router.push('/');
    }

    if (game.gameType === GameType.mcq && !loading && !error) {
      router.push(`/play/mcq/${gameId}`)
    }

    if (userRole === Role.SPECTATOR && game.status !== GameStatus.FINISHED && !isSpectator) {
      addSpectatorToGame({
        variables: { gameId, userId }
      });
    };
  }, [gameId, userId, userRole, game.status, game.playerId, isSpectator]);
  
  const currentQuestion = React.useMemo(() => {
    return game.questions[game.currentQuestionIndex] || { question: "No question available"}
  }, [game.currentQuestionIndex, game.questions]);

  const {mutate: checkAnswer, isPending: isChecking} = useMutation({
    mutationFn: async() => {
      let filledAnswer = currentQuestion.blankedAnswer;
      document.querySelectorAll("#user-blank-input").forEach(input => {
        filledAnswer = filledAnswer.replace("_____", input.value);
        input.value = "";
      })
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
        gameId: game.id,
        userId: game.playerId
      }
      const response = await axios.post('/api/checkAnswer', payload);
      return response.data
    }
  });

  const handleNext = React.useCallback(() => {
    if(isChecking) return;
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer`,
          description: "Answers are matched based on similarity comparisons",
        })  
        if (game.currentQuestionIndex === game.totalQuestionsCount -1) {
          const currentTime = new Date()
          finishGame({variables: {gameId: game.id, timeEnded: currentTime}})
          .catch((error) => {
            console.error("Error finishing game", error);
            toast({
              title: "Error finishing game",
              description: "There was an error finishing the game",
              variant: "destructive",
            })
          })
          return;
        }
        updateGameQuestion({
          variables: {
            gameId: game.id,
            currentQuestionIndex: game.currentQuestionIndex + 1,
            currentQuestionStartTime: new Date(),
          },
        });
      }
    })
  }, [checkAnswer, toast, isChecking, game.currentQuestionIndex, game.totalQuestionsCount, finishGame, game.id]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (userRole === Role.PLAYER) handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleNext]);

  const handleQuestionTimerEnd = React.useCallback(() => {
    if (userRole === Role.PLAYER) handleNext();
  }, [handleNext]);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  if (game.status === GameStatus.OPEN) {
    return <GameOpenView gameId={gameId} gameTopic={game.topic} timeStarted={game.timeStarted} openAt={game.openAt} closeGame={closeGame} />;
  }

  if (game.timeEnded) {
    return <GameEndedView timeStarted={game.timeStarted} gameId={game.id} />
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90wv]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="mr-2 text-slate-400">Topic</span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">{game.topic}</span>
          </p>
          <StartTimer 
            key={new Date(game.currentQuestionStartTime).getTime()} // Reset for each question
            duration={QUESTION_DURATION}
            startAt={game.currentQuestionStartTime}
            onTimerEnd={handleQuestionTimerEnd}
          >
            {(timeLeft) => (
              <div className="flex self-start mt-3 text-slate-400">
                <Timer className="mr-2" />
                {formatTimeDelta(timeLeft)}
              </div>
            )}
          </StartTimer>
        </div>
      </div>
      <Card className='w-full mt-4'>
        <CardHeader className='flex flex-row -items-center'>
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{game.currentQuestionIndex + 1}</div>
            <div className="text-base text-slate-400">{game.totalQuestionsCount}</div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        {currentQuestion && currentQuestion?.blankedAnswer ? (
          <BlankAnswerInput answer={currentQuestion.blankedAnswer} />
        ) : (
          <div className="text-red-500">Question data is unavailable.</div>
        )}
        {userRole === Role.PLAYER && (
          <Button className='mt-2' disabled={isChecking} onClick={() => {
            handleNext();
          }}>
            {isChecking && <Loader2 className='2-4 h-4 mr-2 animated-spin' />}
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default React.memo(OpenEnded);