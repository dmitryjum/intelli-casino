import { gql } from "@apollo/client";

export const GET_ACTIVE_GAMES = gql`
  query GetActiveGames {
    activeGames {
      id
      type
      status
      topic
      userId
      timeStarted
      timeEnded
    }
  }
`;

export const GAME_UPDATED = gql`
  subscription onGameUpdated($gameId: String) {
    gameUpdated(gameId: $gameId) {
      id
      type
      status
      topic
      userId
      timeStarted
      timeEnded
    }
  }
`;
export const OPEN_GAME = gql`
  mutation OpenGame($gameId: String!) {
    openGame(gameId: $gameId) {
      id
      topic
      status
      openAt
      type
    }
  }
`;

export const CLOSE_GAME = gql`
  mutation CloseGame($gameId: String!) {
    closeGame(gameId: $gameId) {
      id
      topic
      status
      openAt
      type
    }
  }
`;

export const FINISH_GAME = gql`
  mutation FinishGame($gameId: String!) {
    finishGame(gameId: $gameId) {
      id
      topic
      status
      openAt
      type
    }
  }
`; 