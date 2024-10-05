'use client';
import { cn, formatTimeDelta } from '@/lib/utils';
import { $Enums, Game, Question } from '@prisma/client'
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button, buttonVariants } from './ui/button';
import { useToast } from './ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import axios from 'axios';
import BlankAnswerInput from './BlankAnswerInput';
import Link from 'next/link';
import { useUserContext } from '@/app/context/UserContext'
import { CLOSE_GAME, FINISH_GAME, GAME_UPDATED, UPDATE_GAME_QUESTION, GET_GAME } from '@/app/api/graphql/operations'
import { useMutation as useApolloMutation, useSubscription, useQuery } from '@apollo/client'
import StartTimer from './StartTimer';

const OPEN_DURATION = 20
const QUESTION_DURATION = 30

type Props = {
  gameId: string
};

const OpenEnded = ({ gameId }: Props) => {
  const [blankAnswer, setBlankAnswer] = React.useState<string>("");
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const {toast} = useToast();
  const { userRole } = useUserContext();
  let game: Game & { questions: Pick<Question, 'id' | 'question' | 'answer'>[] };
  
  const [closeGame, {loading: closeGameLoading, error: closeGameError}] = useApolloMutation(CLOSE_GAME, {
    update(cache, {data: { closeGame }}) {
      cache.writeQuery({
        query: GET_GAME,
        variables: { gameId },
        data: { game: {...game, ...closeGame }}
      });
    }
  });
  const [finishGame, {loading: finishGameLoading, error: finishGameError}] = useApolloMutation(FINISH_GAME, {
    update(cache, {data: { finishGame }}) {
      cache.writeQuery({
        query: GET_GAME,
        variables: { gameId },
        data: { game: {...game, ...finishGame }}
      });
    }
  });
  const [updateGameQuestion, {loading: updateGameQuestionLoading, error: updateGameQuestionError}] = useApolloMutation(UPDATE_GAME_QUESTION, {
    update(cache, {data: { updateGameQuestion }}) {
      cache.writeQuery({
        query: GET_GAME,
        variables: { gameId },
        data: { game: {...game, ...updateGameQuestion }}
      });
    }
  });

  const isMutating = closeGameLoading || finishGameLoading || updateGameQuestionLoading
  const mutationError = closeGameError || finishGameError || updateGameQuestionError
  
  const { data, loading, error } = useQuery<{ game: Game & { questions: Pick<Question, 'id' | 'question' | 'answer'>[] } }>(GET_GAME, {
    variables: { gameId },
    fetchPolicy: 'cache-and-network',
  });

  game = {
    id: data?.game?.id || '', // Ensure id is a string
    userId: data?.game?.userId || '', // Ensure userId is a string
    status: data?.game?.status || $Enums.GameStatus.OPEN, // Provide a default status
    openAt: data?.game?.openAt || null, // Keep as is
    timeStarted: data?.game?.timeStarted || new Date(), // Provide a default date
    topic: data?.game?.topic || '', // Ensure topic is a string
    timeEnded: data?.game?.timeEnded || null, // Keep as is
    gameType: data?.game?.gameType || $Enums.GameType.open_ended, // Provide a default gameType
    currentQuestionIndex: data?.game?.currentQuestionIndex || 0, // Provide a default index
    currentQuestionStartTime: data?.game?.currentQuestionStartTime || null, // Keep as is
    questions: (data?.game as { questions?: any[] })?.questions || []
  }
  
  const currentQuestion = React.useMemo(() => {
    return game.questions[game.currentQuestionIndex] || { question: "No question available"}
  }, [game.currentQuestionIndex, game.questions]);

  useSubscription<{ gameUpdated: Game & { questions: Pick<Question, 'id' | 'question' | 'answer'>[] }}>(GAME_UPDATED, {
    variables: { gameId },
    onData: ({ client, data }) => {
      if (!data) return;
      const updatedGame = {...game, ...data.data?.gameUpdated};
      if (updatedGame) {
        client.writeQuery({
          query: GET_GAME,
          data: {
            game: updatedGame
          }
        });
      }
    },
  });

  const {mutate: checkAnswer, isPending: isChecking} = useMutation({
    mutationFn: async() => {
      let filledAnswer = blankAnswer
      document.querySelectorAll("#user-blank-input").forEach(input => {
        filledAnswer = filledAnswer.replace("_____", input.value);
        input.value = "";
      })
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
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
        if (game.currentQuestionIndex === game.questions.length -1) {
          setHasEnded(true);
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
  }, [checkAnswer, toast, isChecking, game.currentQuestionIndex, game.questions.length, finishGame, game.id]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleNext]);

  const handleCountdownComplete = React.useCallback(() => {
    closeGame({
      variables: {
        gameId: gameId,
        currentQuestionIndex: 0
      }
    })
      .then(() => {
        toast({
          title: 'Game Closed',
          description: `The game has been closed for bets.`,
        });
      })
      .catch((error) => {
        console.error('Error during game closure:', error);
      });
  }, [closeGame, toast, gameId]);

  const handleQuestionTimerEnd = React.useCallback(() => {
    handleNext();
  }, [handleNext]);

  if (loading || isMutating) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (mutationError) return <div>Error: {mutationError.message}</div>

  if (game.status === 'OPEN') {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-blue-500 rounded-md whitespace-nowrap">
          Game will start in 1 minute...
        </div>
        <div className="mt-4">
          <StartTimer 
            // while the key prop doesn't directly set endTimeRef,
            //  changing the key does cause the component to remount
            key={new Date(game.timeStarted).getTime()}
            duration={OPEN_DURATION}
            startAt={game.openAt}
            onTimerEnd={handleCountdownComplete}
          >
            {(timeLeft) => (
              <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-4 w-48">
                <Timer className={`h-6 w-6 ${timeLeft === 0 ? 'text-green-500' : 'text-blue-500'}`} />
                <div className="text-2xl font-bold">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                  {(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>
            )}
          </StartTimer>
        </div>
      </div>
    )
  }

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 top-1/2 left-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed the game!
        </div>
        <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(), "mt-2")}>
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    )
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
            key={new Date(game.timeStarted).getTime()} // Reset for each question
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
            <div className="text-base text-slate-400">{game.questions.length}</div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        {currentQuestion && currentQuestion.answer ? (
          <BlankAnswerInput answer={currentQuestion.answer} setBlankAnswer={setBlankAnswer} />
        ) : (
          <div className="text-red-500">Question data is unavailable.</div>
        )}
        {userRole === "PLAYER" && (
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

// try memo

export default React.memo(OpenEnded);