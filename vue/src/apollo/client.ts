import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import authLink from "./links/authLink";
import refreshLink from "./links/refreshLink";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: import.meta.env.VITE_API_URL + "/graphql",
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: refreshLink.concat(authLink).concat(httpLink),
  cache,
});

export default apolloClient;
