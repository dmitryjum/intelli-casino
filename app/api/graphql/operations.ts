import { gql } from "@apollo/client";

export const GET_ACTIVE_GAMES = gql`
  query GetActiveGames {
    activeGames {
      id
      status
      topic
      gameType
      openAt
      userId
      timeStarted
      timeEnded
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($gameId: String!) {
    game(gameId: $gameId) {
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
        id
        question
        options
        answer
      }
    }
  }
`

export const GAME_UPDATED = gql`
  subscription onGameUpdated($gameId: String) {
    gameUpdated(gameId: $gameId) {
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
        id
        question
        options
        answer
      }
    }
  }
`;

export const OPEN_GAME = gql`
  mutation OpenGame($gameId: String!, $currentQuestionStartTime: DateTime, $currentQuestionIndex: Int) {
    openGame(gameId: $gameId, currentQuestionStartTime: $currentQuestionStartTime, currentQuestionIndex: $currentQuestionIndex) {
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
        id
        question
        options
        answer
      }
    }
  }
`;

export const CLOSE_GAME = gql`
  mutation CloseGame($gameId: String!, $currentQuestionStartTime: DateTime, $currentQuestionIndex: Int) {
    closeGame(gameId: $gameId, currentQuestionStartTime: $currentQuestionStartTime, currentQuestionIndex: $currentQuestionIndex) {
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
        id
        question
        options
        answer
      }
    }
  }
`;

export const FINISH_GAME = gql`
  mutation FinishGame($gameId: String!, $timeEnded: DateTime) {
    finishGame(gameId: $gameId, timeEnded: $timeEnded) {
      id
      topic
      userId
      status
      openAt
      gameType
      timeStarted
      timeEnded
      currentQuestionIndex
      currentQuestionStartTime
      questions {
        id
        question
        options
        answer
      }
    }
  }
`;

export const UPDATE_GAME_QUESTION = gql`
  mutation UpdateGameQuestion($gameId: String!, $currentQuestionStartTime: DateTime!, $currentQuestionIndex: Int!) {
    updateGameQuestion(gameId: $gameId, currentQuestionStartTime: $currentQuestionStartTime, currentQuestionIndex: $currentQuestionIndex) {
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
        id
        question
        options
        answer
      }
    }
  }
`;