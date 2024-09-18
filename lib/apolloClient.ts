import { ApolloClient, ApolloProvider, InMemoryCache, split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
})

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3000/subscriptions',
}))

// Using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export { client, ApolloProvider }