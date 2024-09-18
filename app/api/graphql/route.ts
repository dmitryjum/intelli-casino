import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest, NextResponse } from 'next/server'
import typeDefs from './schema'
import resolvers from './resolvers'


const server = new ApolloServer({ typeDefs, resolvers })

const handler = startServerAndCreateNextHandler<NextRequest, NextResponse>(server, {
  context: async (req, res) => ({ req, res })
});

export { handler as GET, handler as POST }