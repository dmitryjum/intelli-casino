import { gql } from "graphql-tag";
const typeDefs = gql`
  scalar JSON
  scalar DateTime

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
    openAt: DateTime
    gameType: GameType
    userId: String
    timeStarted: DateTime!
    timeEnded: DateTime
    currentQuestionIndex: Int!
    currentQuestionStartTime: DateTime
    questions: [Question!]
  }

  type Question {
    id: ID!
    question: String!
    options: JSON
    answer: String!
    userAnswer: String
  }

  type Query {
    activeGames: [Game!]!
    game(gameId: String!): Game!
  }

  type Mutation {
    openGame(gameId: String!, currentQuestionStartTime: DateTime, currentQuestionIndex: Int): Game!
    closeGame(gameId: String!, currentQuestionStartTime: DateTime, currentQuestionIndex: Int): Game!
    finishGame(gameId: String!, timeEnded: DateTime): Game!
    updateGameQuestion(gameId: String!, currentQuestionStartTime: DateTime!, currentQuestionIndex: Int!): Game!
  }

  type Subscription {
    gameUpdated(gameId: String): Game!
  }
`

export default typeDefs;