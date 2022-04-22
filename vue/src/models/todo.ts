export interface Todo {
  id: string;
  title: string;
  description: string;
  done: boolean;
}

export interface TodoEdge {
  cursor: string;
  node: Todo;
}
