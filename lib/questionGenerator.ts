import { GameType } from "@prisma/client";
import { strict_output } from "@/lib/gpt";

interface QuestionRequest {
  amount: number;
  topic: string;
  type: GameType;
}

interface MCQQuestion {
  question: string;
  answer: string;
  options: string[];
}

interface OpenEndedQuestion {
  question: string;
  answer: string;
}

export async function generateQuestions({ amount, topic, type }: QuestionRequest) {
  let questions = [];

  if (type === 'open_ended') {
    questions = await strict_output(
      "You are an helpful AI that is able to generate a pair of questions and answers, the length of the answer should not exceed 15 words, store all the pairs of answers and questions in the JSON array.",
      new Array(amount).fill(`You are to generate a random hard open-ended question about ${topic}`),
      {
        question: "question",
        answer: "answer with max length of 15 words"
      }
    );
  } else if (type === 'mcq') {
    questions = await strict_output(
      "You are an helpful AI that is able to generate a multiiple mcq questions and answers, the length of each answer should not exceed 15 words",
      new Array(amount).fill(`You are to generate a random mcq question about ${topic}`),
      {
        question: "question",
        answer: "answer with max length of 15 words",
        option1: "1st option with max length of 15 words",
        option2: "2st option with max length of 15 words",
        option3: "3st option with max length of 15 words",
      }
    )
  }

  return questions;
}