import { getAccessToken } from "@/common/auth";
import { setContext } from "@apollo/client/link/context";

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = getAccessToken();

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export default authLink;
