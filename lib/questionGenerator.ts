import { strict_output } from "@/lib/gpt";
import { QuestionRequest, MCQQuestion, OpenEndedQuestion } from "@/app/types/questionTypes";
import { GameType } from "@prisma/client";

export async function generateQuestions({ amount, topic, type }: QuestionRequest) {
  let questions: any = [];

  if (type === GameType.open_ended) {
    questions = await strict_output({
      system_prompt: "You are an helpful AI that is able to generate a pair of questions and answers, the length of the answer should not exceed 15 words, store all the pairs of answers and questions in the JSON array.",
      user_prompt: new Array(amount).fill(`You are to generate a random hard open-ended question about ${topic}`),
      output_format: {
        question: "question",
        answer: "answer with max length of 15 words"
      },
      verbose: true
    }) as OpenEndedQuestion[];
  } else if (type === GameType.mcq) {
    questions = await strict_output({
      system_prompt: "You are an helpful AI that is able to generate a multiiple mcq questions and answers, the length of each answer should not exceed 15 words",
      user_prompt: new Array(amount).fill(`You are to generate a random mcq question about ${topic}`),
      output_format: {
        question: "question",
        answer: "answer with max length of 15 words",
        option1: "1st option with max length of 15 words",
        option2: "2st option with max length of 15 words",
        option3: "3st option with max length of 15 words",
      },
      verbose: true
    }) as MCQQuestion[];
  }

  return questions;
}