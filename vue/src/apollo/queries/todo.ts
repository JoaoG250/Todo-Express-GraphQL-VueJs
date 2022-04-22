import type { PageInfo } from "@/common/types";
import type { TodoEdge } from "@/models/todo";
import gql from "graphql-tag";

export const TODOS_QUERY = gql`
  query todos($first: Int, $after: String, $filter: FilterTodoInput) {
    todos(first: $first, after: $after, filter: $filter) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          description
          done
        }
      }
    }
  }
`;

export interface TodosQueryResult {
  todos: {
    pageInfo: PageInfo;
    edges: TodoEdge[];
  };
}

export interface TodosQueryVariables {
  first?: number;
  after?: string;
  filter?: {
    done: boolean;
  };
}
