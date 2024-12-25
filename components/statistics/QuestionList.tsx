import { Question, UserAnswer } from '@prisma/client'
import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { cn } from '@/lib/utils';

type Props = {
  questions: Question[];
  userAnswers: UserAnswer[];
}

const QuestionList = ({questions, userAnswers}: Props) => {
  let gameType = questions[0].questionType;
  return (
    <Table className="mt-4">
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[10px]'>No.</TableHead>
          <TableHead>Question & Correct Answer</TableHead>
          <TableHead>Your Answer</TableHead>
          {gameType === 'open_ended' && (
            <TableHead className='w-[10px] text-right'>Accuracy</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        <>
        {questions.map((question, index) => {
          const userAnswer = userAnswers.find(answer => answer.questionId === question.id);

          return(
            <TableRow key={question.id}>
              <TableCell className='font-medium'>{index + 1}</TableCell>
              <TableCell>
                {question.question}
                <br />
                <br />
                <span className='font-semibold'>{question.answer}</span>
              </TableCell>
              {
                gameType === 'mcq' && (
                  <TableCell className={cn(
                    {
                      'text-green-600': userAnswer?.isCorrect,
                      'text-red-600':!userAnswer?.isCorrect,
                    }
                  )}>
                    {userAnswer?.answer || 'No answer provided'}
                  </TableCell>
                )
              }
              {gameType === 'open_ended' && (
                <>
                  <TableCell>{userAnswer?.answer || 'No answer provided'}</TableCell>
                  <TableCell className='text-right'>{userAnswer?.percentageCorrect || 'N/A'}</TableCell>
                </>
              )}
            </TableRow>
          )
        })}
        </>
      </TableBody>
    </Table>
  )
}

export default QuestionList