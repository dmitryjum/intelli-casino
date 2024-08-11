import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { compareTwoStrings } from "string-similarity"; // used for open ended answers comparison

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const {questionId, userAnswer} = checkAnswerSchema.parse(body);
    const question = await prisma.question.findUnique({
      where: {id: questionId},
    });
    if (!question) {
      return NextResponse.json(
        {error: "Question not found"},
        {status: 404}
      )
    }

    await prisma.question.update({
      where: {id: questionId},
      data: {
        userAnswer
      }
    })

    if(question.questionType === 'mcq') {
      const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim(); // compare user and question answers
      await prisma.question.update({
        where: {id: questionId},
        data: {
          isCorrect,
        },
      });
      return NextResponse.json({isCorrect}, {status: 200})
    } else if (question.questionType === 'open_ended') {
      // next line gets the similarity score for the users's answer and the question correct answer to give user some slack
      let percentageSimilar = compareTwoStrings(userAnswer.toLowerCase().trim(), question.answer.toLowerCase().trim());
      percentageSimilar = Math.round(percentageSimilar * 100);
      await prisma.question.update({
        where: {id: questionId},
        data: {
          percentageCorrect: percentageSimilar
        }
      });
      
      return NextResponse.json(
        { percentageSimilar }, { status: 200 }
      )
    }
  } catch(error: any) {
    if(error instanceof ZodError) {
      return NextResponse.json(
        {error: error.issues},
        {status: 400}
      )
    }
  }
}