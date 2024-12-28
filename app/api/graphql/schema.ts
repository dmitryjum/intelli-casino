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

  type User {
    id: ID!
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
    quiz: Quiz!
    userAnswers: [UserAnswer]
    spectators: [User]
  }

  type Quiz {
    id: ID!
    topic: String!
    userId: String
    gameType: GameType
    questions: [Question!]
    games: [Game]
    _count: QuestionsCount
  }

  type QuestionsCount {
    questions: Int!
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
    userId: String!
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
    addSpectatorToGame(gameId: String!, userId: String!): Game!
  }

  type Subscription {
    gameUpdated(gameId: String): Game!
  }
`

export default typeDefs;