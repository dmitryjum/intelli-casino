import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import keyword_extractor from 'keyword-extractor';

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
