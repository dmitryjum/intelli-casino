import { ApolloClient, ApolloProvider, InMemoryCache, split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URI,
  credentials: 'same-origin',
})

// WebSocket link for subscriptions
const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(
  createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URI || 'ws://localhost:4000/graphql'
  })
) : null;

// Using the split function to divide traffic between HTTP and WebSocket
const splitLink = typeof window !== 'undefined' && wsLink != null ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
) : httpLink;

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          activeGames: {
            merge(existing = [], incoming: any[]) {
              return incoming;
            },
          },
        },
      },
      Game: {
        keyFields: ['id'],
      },
    },
  }),
});

export { client, ApolloProvider }