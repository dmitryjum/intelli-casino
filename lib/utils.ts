import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import keyword_extractor from 'keyword-extractor';
import { PrismaClient, Prisma } from '@prisma/client';
import { GameData } from "@/app/types/gameData";
// import { Game } from "@prisma/client";

const prisma = new PrismaClient();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeDelta(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const secs = Math.floor(seconds - hours * 3600 - minutes * 60);
  const parts  = [];
  if (hours > 0) {
    [parts.push(`${hours}h`)];
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0) {
    parts.push(`${secs}s`);
  }
  return parts.join(" ");
}

export const handleCountdownComplete = async (gameId: string, closeGame: Function, toast: Function) => {
  try {
    await closeGame({
      variables: {
        gameId: gameId,
        currentQuestionIndex: 0
      }
    });
    toast({
      title: 'Game Closed',
      description: `The game has been closed for bets.`,
    });
  } catch (error) {
    console.error('Error during game closure:', error);
  }
};

export function generateBlankedAnswer(answer: string): string {
  const BLANKS = '_____';
  const extractedKeywords = keyword_extractor.extract(answer, {
    language: "english",
    remove_digits: true,
    return_changed_case: false,
    remove_duplicates: false,
  });
  const shuffledKeywords = extractedKeywords.sort(() => Math.random() - 0.5);
  const selectedKeywords = shuffledKeywords.slice(0, 2);

  return selectedKeywords.reduce((acc, keyword) => {
    return acc.replace(keyword, BLANKS);
  }, answer);
}

export const getGameUpdateData = async (gameId: string, updatedData: any) => {
  const includeClause: any = {
    quiz: {
      select: {
        id: true,
        topic: true,
        gameType: true,
        _count: { select: { questions: true } },
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            answer: true,
            blankedAnswer: true,
          },
          orderBy: {
            id: 'asc'
          },
        },
      },
    },
    userAnswers: {
      select: {
        id: true,
        questionId: true,
        answer: true,
        userId: true,
      },
    },
    spectators: {
      select: {
        id: true
      }
    },
  };
  // if this function isn't called from finishGame or addSpectatorToGame mutations, then we need to check for currentQuestionIndex
  if ((!updatedData.status && !updatedData.spectators) || (updatedData.status && updatedData.status !== 'FINISHED')) {
    if (updatedData.currentQuestionIndex === undefined) {
      updatedData.currentQuestionIndex = 0;
      delete updatedData.currentQuestionStartTime;
    }
    includeClause.quiz.select.questions.take = updatedData.currentQuestionIndex + 1;
  }
  
  const updatedGame: any = await prisma.game.update({
    where: { id: gameId },
    data: updatedData,
    include: includeClause,
  });
  console.log('Updated game:', updatedGame);
  return updatedGame
}