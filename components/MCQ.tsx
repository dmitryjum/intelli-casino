'use client'
import { Role, GameType, GameStatus, Game, Question } from '@prisma/client'
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
import { useGames } from '@/app/hooks/useGames';
import StartTimer from './StartTimer';
import { OPEN_DURATION, QUESTION_DURATION } from '@/lib/constants';

type Props = {
  gameId: string
}

const MCQ = ({ gameId }: Props) => {
  const { userRole } = useUserContext();
  const { gameData, loading, error, closeGame, finishGame, updateGameQuestion } = useGames({ gameId, userRole });
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const {toast} = useToast();

  let game: Game & { questions: Pick<Question, 'id' | 'question' | 'answer' | 'options'>[] };

  game = {
    id: gameData?.id || '', // Ensure id is a string
    userId: gameData?.userId || '', // Ensure userId is a string
    status: gameData?.status || GameStatus.OPEN, // Provide a default status
    openAt: gameData?.openAt || null, // Keep as is
    timeStarted: gameData?.timeStarted || new Date(), // Provide a default date
    topic: gameData?.topic || '', // Ensure topic is a string
    timeEnded: gameData?.timeEnded || null, // Keep as is
    gameType: gameData?.gameType || GameType.open_ended, // Provide a default gameType
    currentQuestionIndex: gameData?.currentQuestionIndex || 0, // Provide a default index
    currentQuestionStartTime: gameData?.currentQuestionStartTime || null, // Keep as is
    questions: (gameData as { questions?: any[] })?.questions || []
  }

  const currentQuestion = React.useMemo(() => {
    return game.questions[game.currentQuestionIndex] || { question: "No question available"}
  }, [game.currentQuestionIndex, game.questions]);

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
        if (game.currentQuestionIndex === game.questions.length -1) {
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

  const options = React.useMemo(() => {
    if (!currentQuestion) return []
    if (!currentQuestion.options) return []

    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const handleCountdownComplete = React.useCallback(() => {
    // Automatically close the game when countdown finishes
    closeGame({ variables: { gameId: game.id, currentQuestionIndex: 0 } })
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

  const handleQuestionTimerEnd = React.useCallback(() => {
    if (userRole === Role.PLAYER) handleNext();
  }, [handleNext]);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  if (game.status === GameStatus.OPEN) {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 top-1/2 left-1/2">
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

  if (game.timeEnded) {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 top-1/2 left-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in {formatTimeDelta(differenceInSeconds(new Date().getTime(), game.timeStarted))}
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
        <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} />
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
        {options.map((option, index) => {
          return (
            <Button disabled={userRole === Role.SPECTATOR} key={index} className='justify-start w-full py-8 mb-4'
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

export default React.memo(MCQ);