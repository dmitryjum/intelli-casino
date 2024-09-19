import { gql } from "graphql-tag";
const typeDefs = gql`
  enum GameStatus {
    OPEN
    CLOSED
    FINISHED
  }

  enum GameType {
    MCQ
    OPEN_ENDED
  }

  type Game {
    id: ID!
    status: GameStatus!
    topic: String!
    openAt: String
    type: GameType!
    userId: String!
    timeStarted: String!
    timeEnded: String!
  }

  type Query {
    activeGames: [Game!]!
  }

  type Mutation {
    openGame(gameId: ID!): Game!
    closeGame(gameId: ID!): Game!
    finishGame(gameId: ID!): Game!
  }

  type Subscription {
    activeGamesUpdated: [Game!]!
  }
`

export default typeDefs;