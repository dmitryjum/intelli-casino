const typeDefs = `
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
    name: String!
    status: GameStatus!
    openAt: String
    type: GameType!
    userId: String!
    createdAt: String!
    updatedAt: String!
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