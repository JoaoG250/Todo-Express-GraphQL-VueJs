import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export interface LoginMutationResult {
  login: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginMutationVariables {
  email: string;
  password: string;
}

export const REGISTER_MUTATION = gql`
  mutation register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password)
  }
`;

export interface RegisterMutationResult {
  register: boolean;
}

export interface RegisterMutationVariables {
  name: string;
  email: string;
  password: string;
}

export interface RefreshMutationResult {
  refreshToken: {
    accessToken: string;
    refreshToken: string;
  };
}
