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
    openAt: DateTime
    playerId: String
    timeStarted: DateTime!
    timeEnded: DateTime
    currentQuestionIndex: Int!
    currentQuestionStartTime: DateTime
    userAnswers: [UserAnswer]
  }

  type Quiz {
    id: ID!
    topic: String!
    userId: String
    gameType: GameType
    questions: [Question!]
    games: [Game]
  }

  type Question {
    id: ID!
    question: String!
    options: JSON
    answer: String!
    userAnswer: String
    blankedAnswer: String
  }

  type UserAnswer {
    id: ID!
    questionId: String!
    answer: String
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