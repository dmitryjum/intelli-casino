import { gql } from "@apollo/client";

// Fragment for Question
export const QUESTION_FRAGMENT = gql`
  fragment QuestionFields on Question {
    id
    question
    options
    answer
  }
`;

// Fragment for Game, including Questions
export const GAME_FRAGMENT = gql`
  fragment GameFields on Game {
    id
    status
    topic
    userId
    openAt
    gameType
    timeStarted
    timeEnded
    currentQuestionIndex
    currentQuestionStartTime
    questions {
      ...QuestionFields
    }
  }
  ${QUESTION_FRAGMENT}
`;