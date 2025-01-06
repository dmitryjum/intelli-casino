import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import axios from "axios";
import { Role, GameType, Prisma } from "@prisma/client";
import { generateQuestions } from "@/lib/questionGenerator";
import { MCQQuestion, OpenEndedQuestion } from "@/app/types/questionTypes";

// /api/game
export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({
        error: "You must be logged in"
      }, { status: 401 });
    } else if (session?.user.role !== Role.PLAYER) {
      return NextResponse.json({ error: 'Unauthorized action, you must be a player' }, { status: 403 });
    }
    const { id: userId } = session.user;

    const body = await req.json();
    // fits the request params into quiz creation schema and destructures it to create a new Game db record
    const {amount, topic, type} = quizCreationSchema.parse(body);
    // Check if a Game (topic) already exists
    let quiz = await prisma.quiz.findUnique({
      where: { topic },
      select: {
        id: true,
        userId: true
      }, // no need to fetch everything, just ID
    });
    
    if (quiz) {
      // The topic exists -> check if the user has participated
      const alreadyPlayedOrSpectated = await prisma.game.findFirst({
        where: {
          quizId: quiz.id,
          OR: [
            { playerId: userId },
            { spectators: { some: { id: userId } } },
          ],
        },
        select: { id: true },
      });

      if (alreadyPlayedOrSpectated) {
        // The user has already played or watched -> block
        return NextResponse.json(
          { error: "You have already played or spectated this topic choose different topic" },
          { status: 400 }
        );
      }

      // If user hasn’t played or seen it -> create a new Game
      //     (No need to create questions again or call OpenAI)
      const newGame = await prisma.game.create({
        data: {
          quizId: quiz.id,
          playerId: userId,
          timeStarted: new Date()
        },
      });

      return NextResponse.json({
        message: "Game already exists; created new instance.",
        quizId: quiz.id,
        gameId: newGame.id,
      });
    }
// Logic below: If quiz doesn't exist -> create new quiz, game, set of questions
    quiz = await prisma.quiz.create({
      data: {
        gameType: type,
        userId,
        topic
      }
    });

    await prisma.topicCount.upsert({
      where: {
        topic
      },
      create: {
        topic,
        count: 1
      },
      update: {
        count: {
          increment: 1
        }
      }
    });

    const questions = await generateQuestions({amount, topic, type});
    
    let manyData: Prisma.QuestionCreateManyInput | Prisma.QuestionCreateManyInput[] = [];
    if (type === GameType.mcq) { 
      manyData = questions.map((question: MCQQuestion) => {
        let options = [question.answer, question.option1, question.option2, question.option3];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          quizId: quiz.id, // comes from recently created quiz db recod above
          questionType: GameType.mcq
        }
      });
    } else if (type === GameType.open_ended) {
      manyData = questions.map((question: OpenEndedQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          quizId: quiz.id,
          questionType: GameType.open_ended
        }
      });
    }

    await prisma.question.createMany({ data: manyData });

    // Now that the Quiz + Questions exist, create the new Game
    const newGame = await prisma.game.create({
      data: {
        quizId: quiz.id,
        playerId: userId,
        timeStarted: new Date(),
      },
    });
    
    return NextResponse.json({
      message: "Created new game + instance",
      quizId: quiz.id,
      gameId: newGame.id,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      console.error("unknown error while creating game/instance", error);
      return NextResponse.json({ error: error }, { status: 500 })
    }
  }
}