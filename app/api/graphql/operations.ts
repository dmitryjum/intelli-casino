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

export const ACTIVE_GAMES_UPDATED = gql`
  subscription onActiveGamesUpdated {
    activeGamesUpdated {
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
  mutation OpenGame($gameId: ID!) {
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
  mutation CloseGame($gameId: ID!) {
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
  mutation FinishGame($gameId: ID!) {
    finishGame(gameId: $gameId) {
      id
      topic
      status
      openAt
      type
    }
  }
`; 