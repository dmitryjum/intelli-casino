import { GameStatus, GameType } from '@prisma/client';

export type GameData = {
  game: {
    id: string;
    playerId: string;
    status: GameStatus;
    openAt?: Date;
    currentQuestionIndex: number;
    currentQuestionStartTime: Date;
    timeStarted: Date;
    timeEnded?: Date;
    quiz: {
      topic: string;
      gameType: GameType;
      questions: {
        id: string;
        question: string;
        answer: string;
        options?: any;
        blankedAnswer: string;
      }[];
    };
    userAnswers: {
      questionId: string;
      answer: string;
    }[];
    spectators: {
      id: string;
    }[]
  }
};