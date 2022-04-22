import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export interface LoginMutationResponse {
  login: {
    accessToken: string;
    refreshToken: string;
  };
}

export const REGISTER_MUTATION = gql`
  mutation register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password)
  }
`;

export interface RegisterMutationResponse {
  register: boolean;
}

export interface RefreshMutationResponse {
  refreshToken: {
    accessToken: string;
    refreshToken: string;
  };
}
