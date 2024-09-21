import { gql } from "graphql-tag";
const typeDefs = gql`
  enum GameStatus {
    OPEN
    CLOSED
    FINISHED
  }

  enum GameType {
    mcq
    open_ended
  }

  type Game {
    id: ID!
    status: GameStatus!
    topic: String!
    openAt: String
    type: GameType
    userId: String!
    timeStarted: String!
    timeEnded: String
  }

  type Query {
    activeGames: [Game!]!
    game(id: String!): Game!
  }

  type Mutation {
    openGame(gameId: String!): Game!
    closeGame(gameId: String!): Game!
    finishGame(gameId: String!): Game!
  }

  type Subscription {
    activeGamesUpdated: [Game!]!
  }
`

export default typeDefs;