import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import keyword_extractor from 'keyword-extractor';
import { PrismaClient } from '@prisma/client';

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