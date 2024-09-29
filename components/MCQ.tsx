'use client'
import { Game, Question } from '@prisma/client'
import { differenceInSeconds } from 'date-fns'
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react'
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button, buttonVariants } from './ui/button'
import MCQCounter from './MCQCounter'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'
import { checkAnswerSchema } from '@/schemas/form/quiz'
import { useToast } from './ui/use-toast'
import Link from 'next/link'
import { cn, formatTimeDelta } from '@/lib/utils'
import { useUserContext } from '@/app/context/UserContext'
import { CLOSE_GAME, FINISH_GAME, GAME_UPDATED } from '@/app/api/graphql/operations'
import { useMutation as useApolloMutation, useSubscription } from '@apollo/client'

type Props = {
  game: Game & {questions: Pick<Question, 'id' | 'options' | 'question'>[]}
}

const MCQ = ({game}: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const {toast} = useToast();
  const { userRole } = useUserContext();
  const [now, setNow] = React.useState<Date>(new Date());
  const [gameStatus, setGameStatus] = React.useState<$Enums.GameStatus>(game.status);
  const [closeGame] = useApolloMutation(CLOSE_GAME);
  const [finishGame] = useApolloMutation(FINISH_GAME);

  useSubscription<{ gameUpdated: Game }>(GAME_UPDATED, {
    variables: { gameId: game.id },
    onData: ({ data }) => {
      const updatedGame = data.data?.gameUpdated;
      if (updatedGame) {
        setGameStatus(updatedGame.status);
      }
    },
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => { clearInterval(interval) }
  }, [hasEnded])

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex]
  }, [questionIndex, game.questions]);
  
  const {mutate: checkAnswer, isPending: isChecking} = useMutation({
    mutationFn: async() => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
      }
      const response = await axios.post('/api/checkAnswer', payload);
      return response.data
    }
  });

  const handleNext = React.useCallback(() => {
    if(isChecking) return;
    checkAnswer(undefined, {
      onSuccess: ({isCorrect}) => {
        if (isCorrect) {
          toast({
            title: "Correct answer!",
            variant: 'success'
          })
          setCorrectAnswers((prev) => prev + 1);
        } else {
          toast({
            title: "Incorrect answer!",
            variant: 'destructive'
          })
          setWrongAnswers((prev) => prev + 1);
        }
        if (questionIndex === game.questions.length -1) {
          setHasEnded(true);
          finishGame({variables: {gameId: game.id, timeEnded: now}})
          .catch((error) => {
            console.error("Error finishing game", error);
            toast({
              title: "Error finishing game",
              variant: 'destructive'
            })
          })
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      }
    })
  }, [checkAnswer, toast, isChecking, questionIndex, game.questions.length, finishGame, game.id]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1') {
        setSelectedChoice(0);
      } else if (event.key === '2') {
        setSelectedChoice(1);
      } else if (event.key === '3') {
        setSelectedChoice(2);
      } else if (event.key === '4') {
        setSelectedChoice(3);
      } else if (event.key === 'Enter') {
        handleNext();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleNext]);

  React.useEffect(() => {
    if (game.status === 'OPEN') {
      // Start 1-minute timer
      const timerId = setTimeout(() => {
        // Mutate game status to CLOSED
        closeGame({ variables: { gameId: game.id }})
        .then(() => {
          toast({
            title: 'Game Closed',
            description: `The game has been closed for bets.`,
          });
        })
        .catch((error) => {
          console.error("Error closing game:", error);
          toast({
            title: "Error",
            description: "There was an error closing the game.",
            variant: 'destructive',
          })
        });
      }, 60000); // 60,000 ms = 1 minute

      return () => clearTimeout(timerId);
    }
  }, [game.status, game.id, closeGame, toast]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return []
    if (!currentQuestion.options) return []

    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const handleCountdownComplete = React.useCallback(() => {
    // Automatically close the game when countdown finishes
    closeGame({ variables: { gameId: game.id } })
      .then(() => {
        toast({
          title: 'Game Closed',
          description: `The game has been closed for bets.`,
        });
      })
      .catch((error) => {
        console.error('Error during game closure:', error);
      });
  }, [closeGame, toast, game.id]);

  if (game.status === 'OPEN') {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 top-1/2 left-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-blue-500 rounded-md whitespace-nowrap">
          Game will start in 1 minute...
        </div>
         <div className="mt-4">
            <StartTimer timeStarted={new Date(game.timeStarted)}
              duration={60} // Duration in seconds
              onTimerEnd={handleCountdownComplete} />
          </div>
      </div>
    )
  }

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 top-1/2 left-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
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
          {/* topic */}
          <p>
            <span className="mr-2 text-slate-400">Topic</span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">{game.topic}</span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {now && formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} />
      </div>
      <Card className='w-full mt-4'>
        <CardHeader className='flex flex-row -items-center'>
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">{game.questions.length}</div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => {
          return (
            <Button key={index} className='justify-start w-full py-8 mb-4'
            variant={selectedChoice === index ? 'default' : 'secondary'}
            onClick={() => {
              setSelectedChoice(index);
            }}>
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          )
        })}
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

export default MCQ