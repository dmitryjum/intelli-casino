import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import cors from 'cors';
import typeDefs from '@/app/api/graphql/schema';
import resolvers from '@/app/api/graphql/resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authOptions } from '@/lib/nextauth';
import { getServerSession } from 'next-auth'
import cookieParser from 'cookie-parser';
import { GraphQLError } from 'graphql';

(async () => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/api/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),  
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    '/api/graphql',
    cors<cors.CorsRequest>({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
    cookieParser(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const session = await getServerSession(req, res, authOptions);
        if (!session?.user) {
          throw new GraphQLError('Unauthorized', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          });
        }
        return { req, res, session };
      }
    }),
  );

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/api/graphql`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/api/graphql`);
  });
})();