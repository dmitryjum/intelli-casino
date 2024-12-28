import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { compareTwoStrings } from "string-similarity"; // used for open ended answers comparison
import { getAuthSession } from '@/lib/nextauth';

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({
        error: "You must be logged in"
      }, { status: 401 });
    }
    const body = await req.json();
    const {questionId, userAnswer, gameId, userId} = checkAnswerSchema.parse(body);
    const question = await prisma.question.findUnique({
      where: {id: questionId},
    });

    if (session?.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized action' }, { status: 403 });
    }

    if (!question) {
      return NextResponse.json(
        {error: "Question not found"},
        {status: 404}
      )
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    } else if (game.playerId !== session?.user.id) {
      return NextResponse.json({ error: 'Unauthorized action' }, { status: 403 });
    }

    let isCorrect = false;
    let percentageCorrect = null;

    if (question.questionType === 'mcq') {
      isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLocaleLowerCase().trim();
    } else if (question.questionType === 'open_ended') {
      percentageCorrect = Math.round(compareTwoStrings(userAnswer.toLowerCase().trim(), question.answer.toLowerCase().trim()) * 100);
    }

    await prisma.userAnswer.create({
      data: {
        questionId,
        gameId,
        userId,
        answer: userAnswer,
        isCorrect,
        percentageCorrect,
      },
    });

    return NextResponse.json(
      { isCorrect, percentageSimilar: percentageCorrect },
      { status: 200}
    )
  } catch(error: any) {
    if(error instanceof ZodError) {
      return NextResponse.json(
        {error: error.issues},
        {status: 400}
      )
    } else {
      console.error("Error processing answer:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}