import { GameType } from "@prisma/client";

export interface QuestionRequest {
  amount: number;
  topic: string;
  type: GameType;
}

export interface MCQQuestion {
  question: string,
  answer: string,
  option1: string,
  option2: string,
  option3: string,
}

export interface OpenEndedQuestion {
  question: string;
  answer: string;
}