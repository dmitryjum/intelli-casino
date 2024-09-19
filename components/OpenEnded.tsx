'use client';
import { cn, formatTimeDelta } from '@/lib/utils';
import { Game, Question } from '@prisma/client'
import { differenceInSeconds } from 'date-fns';
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
import { CLOSE_GAME, FINISH_GAME } from '@/app/api/graphql/operations'
import { useMutation as useApolloMutation } from '@apollo/client'

type Props = {
  game: Game & {questions: Pick<Question, 'id' | 'question' | 'answer'>[] };
};

const OpenEnded = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [blankAnswer, setBlankAnswer] = React.useState<string>("");
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const {toast} = useToast();
  const { userRole } = useUserContext();
  const [now, setNow] = React.useState<Date | string>("");

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex]
  }, [questionIndex, game.questions]);

  const [closeGame] = useApolloMutation(CLOSE_GAME);
  const [finishGame] = useApolloMutation(FINISH_GAME);

  React.useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => { clearInterval(interval) }
  }, [hasEnded])


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
        if (questionIndex === game.questions.length -1) {
          setHasEnded(true);
          finishGame({variables: {gameId: game.id}})
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
        setQuestionIndex((prev) => prev + 1);
      }
    })
  }, [checkAnswer, toast, isChecking, questionIndex, game.questions.length, finishGame]);

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

  React.useEffect(() => {
    if (game.status === 'OPEN') {
      const timerId = setTimeout(() => {
        closeGame({variables: {gameId: game.id}})
        .catch((error) => {
          console.error("Error closing game", error);
          toast({
            title: "Error closing game",
            
          })
        })
      }, 60000)
      return () => {
        clearTimeout(timerId);
      }
    }
  }, [game.status, closeGame, game.id, toast]);

  if (game.status === 'OPEN') {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 top-1/2 left-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-blue-500 rounded-md whitespace-nowrap">
          Game will start in 1 minute...
        </div>
        <div className="mt-4">
          <Timer className="w-6 h-6 animate-spin" />
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
        {/* <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} /> */}
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
        <BlankAnswerInput answer={currentQuestion.answer} setBlankAnswer={setBlankAnswer}/>
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

export default OpenEnded