'use client'
import { Role, GameStatus} from '@prisma/client'
import { ChevronRight, Loader2, Timer } from 'lucide-react'
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import MCQCounter from './MCQCounter'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'
import { checkAnswerSchema } from '@/schemas/form/quiz'
import { useToast } from './ui/use-toast'
import { formatTimeDelta } from '@/lib/utils'
import { useUserContext } from '@/app/context/UserContext'
import { useGames } from '@/app/hooks/useGames';
import StartTimer from './StartTimer';
import { QUESTION_DURATION } from '@/lib/constants';
import GameOpenView from './GameOpenView'
import GameEndedView from './GameEndedView'

type Props = {
  gameId: string
}

const MCQ = ({ gameId }: Props) => {
  const { userRole } = useUserContext();
  const { game, loading, error, closeGame, finishGame, updateGameQuestion } = useGames({ gameId, userRole });
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const {toast} = useToast();

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

  const handleQuestionTimerEnd = React.useCallback(() => {
    if (userRole === Role.PLAYER) handleNext();
  }, [handleNext]);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  if (game.status === GameStatus.OPEN) {
    return <GameOpenView gameId={gameId} game={game} closeGame={closeGame} />;
  }

  if (game.timeEnded) {
    return <GameEndedView game={game} />
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