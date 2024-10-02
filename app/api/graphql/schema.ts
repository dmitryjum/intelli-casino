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
    gameType: GameType
    userId: String!
    timeStarted: String!
    timeEnded: String
    currentQuestionIndex: Int!
    currentQuestionStartTime: String
  }

  type Query {
    activeGames: [Game!]!
    game(id: String!): Game!
  }

  type Mutation {
    openGame(gameId: String!, currentQuestionStartTime: String, currentQuestionIndex: Int): Game!
    closeGame(gameId: String!, currentQuestionStartTime: String, currentQuestionIndex: Int): Game!
    finishGame(gameId: String!, timeEnded: String): Game!
    updateGameQuestion(gameId: String!, currentQuestionStartTime: String!, currentQuestionIndex: Int!): Game!
  }

  type Subscription {
    gameUpdated(gameId: String): Game!
  }
`

export default typeDefs;