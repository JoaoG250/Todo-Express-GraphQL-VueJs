import gql from "graphql-tag";

export const CREATE_TODO_MUTATION = gql`
  mutation createTodo($data: CreateTodoInput!) {
    createTodo(data: $data) {
      id
      title
      description
      done
    }
  }
`;

export interface CreateTodoMutationResult {
  createTodo: {
    id: string;
    title: string;
    description: string;
    done: boolean;
  };
}

export interface CreateTodoMutationVariables {
  data: {
    title: string;
    description: string;
  };
}

export const UPDATE_TODO_MUTATION = gql`
  mutation updateTodo($id: ID!, $data: UpdateTodoInput!) {
    updateTodo(id: $id, data: $data) {
      id
      title
      description
      done
    }
  }
`;

export interface UpdateTodoMutationResult {
  updateTodo: {
    id: string;
    title: string;
    description: string;
    done: boolean;
  };
}

export interface UpdateTodoMutationVariables {
  id: string;
  data: {
    title: string;
    description: string;
    done: boolean;
  };
}

export const DELETE_TODO_MUTATION = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
      title
      description
      done
    }
  }
`;

export interface DeleteTodoMutationResult {
  deleteTodo: {
    id: string;
    title: string;
    description: string;
    done: boolean;
  };
}

export interface DeleteTodoMutationVariables {
  id: string;
}
