import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

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