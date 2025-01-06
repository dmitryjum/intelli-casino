import { gql } from "@apollo/client";
import { GAME_FRAGMENT } from "./fragments";

export const GET_ACTIVE_GAMES = gql`
  query GetActiveGames {
    activeGames {
     ...GameFields
    }
  }
  ${GAME_FRAGMENT}
`;

export const GET_GAME = gql`
  query GetGame($gameId: String!) {
    game(gameId: $gameId) {
      ...GameFields
    }
  }
  ${GAME_FRAGMENT}
`

export const GAME_UPDATED = gql`
  subscription onGameUpdated($gameId: String) {
    gameUpdated(gameId: $gameId) {
      ...GameFields
    }
  }
  ${GAME_FRAGMENT}
`;

export const OPEN_GAME = gql`
  mutation OpenGame($gameId: String!, $currentQuestionStartTime: DateTime, $currentQuestionIndex: Int) {
    openGame(gameId: $gameId, currentQuestionStartTime: $currentQuestionStartTime, currentQuestionIndex: $currentQuestionIndex) {
      ...GameFields
    }
  }
  ${GAME_FRAGMENT}
`;

export const CLOSE_GAME = gql`
  mutation CloseGame($gameId: String!, $currentQuestionStartTime: DateTime, $currentQuestionIndex: Int) {
    closeGame(gameId: $gameId, currentQuestionStartTime: $currentQuestionStartTime, currentQuestionIndex: $currentQuestionIndex) {
      ...GameFields
    }
  }
  ${GAME_FRAGMENT}
`;

export const FINISH_GAME = gql`
  mutation FinishGame($gameId: String!, $timeEnded: DateTime) {
    finishGame(gameId: $gameId, timeEnded: $timeEnded) {
      ...GameFields
    }
  }
  ${GAME_FRAGMENT}
`;

export const UPDATE_GAME_QUESTION = gql`
  mutation UpdateGameQuestion($gameId: String!, $currentQuestionStartTime: DateTime!, $currentQuestionIndex: Int!) {
    updateGameQuestion(gameId: $gameId, currentQuestionStartTime: $currentQuestionStartTime, currentQuestionIndex: $currentQuestionIndex) {
      ...GameFields
    }
  }
  ${GAME_FRAGMENT}
`;

export const ADD_SPECTATOR_TO_GAME = gql`
  mutation AddSpectatorToGame($gameId: String!, $userId: String!) {
    addSpectatorToGame(gameId: $gameId, userId: $userId) {
      ...GameFields
    }
  }
  ${GAME_FRAGMENT}
`;