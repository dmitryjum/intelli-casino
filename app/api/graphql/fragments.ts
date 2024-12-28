import { gql } from "@apollo/client";

// Fragment for Question
export const QUESTION_FRAGMENT = gql`
  fragment QuestionFields on Question {
    id
    question
    options
    answer
    blankedAnswer
  }
`;

// Fragment for UserAnswer
export const USER_ANSWER_FRAGMENT = gql`
  fragment UserAnswerFields on UserAnswer {
    id
    questionId
    answer
  }
`;

// Fragment for Quiz, including Questions
export const QUIZ_FRAGMENT = gql`
  fragment QuizFields on Quiz {
    id
    topic
    gameType
    _count {
      questions
    }
    questions {
      ...QuestionFields
    }
  }
    ${QUESTION_FRAGMENT}
`;

// Fragment for Game, including Questions
export const GAME_FRAGMENT = gql`
  fragment GameFields on Game {
    id
    status
    playerId
    openAt
    timeStarted
    timeEnded
    currentQuestionIndex
    currentQuestionStartTime
    quiz {
      ...QuizFields
    }
    userAnswers {
      ...UserAnswerFields
    }
    spectators {
      id
    }
  }
  ${QUIZ_FRAGMENT}
  ${USER_ANSWER_FRAGMENT}
`;