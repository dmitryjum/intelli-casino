import { ApolloServer } from '@apollo/server'
import { NextApiRequest, NextApiResponse } from 'next'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest, NextResponse } from 'next/server'
import typeDefs from './schema'
import resolvers from './resolvers'

const schema = makeExecutableSchema({ typeDefs, resolvers })

const apolloServer = new ApolloServer({ schema })
const startServer = apolloServer.start()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000') // Replace with your client's origin
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  return startServerAndCreateNextHandler<NextRequest, NextResponse>(apolloServer, {
    context: async (req: NextApiRequest, res: NextApiResponse) => ({ req, res }),
  });
  
}