import { Prisma, PrismaClient, Todo, User } from "@prisma/client";
import prisma from "../db";

type TodoWithUser = (Todo & { user: User }) | null;

export class TodoService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async todo(where: Prisma.TodoWhereUniqueInput): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where });
  }

  async todoWithUser(
    where: Prisma.TodoWhereUniqueInput
  ): Promise<TodoWithUser> {
    return this.prisma.todo.findUnique({
      where,
      include: { user: true },
    });
  }

  async todos(args: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TodoWhereUniqueInput;
    where?: Prisma.TodoWhereInput;
    orderBy?: Prisma.Enumerable<Prisma.TodoOrderByWithRelationInput>;
  }): Promise<Todo[]> {
    const { skip, take, cursor, where, orderBy } = args;
    return this.prisma.todo.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createTodo(data: Prisma.TodoCreateInput): Promise<Todo> {
    return this.prisma.todo.create({ data });
  }

  async updateTodo(args: {
    where: Prisma.TodoWhereUniqueInput;
    data: Prisma.TodoUpdateInput;
  }): Promise<Todo> {
    const { where, data } = args;
    return this.prisma.todo.update({ where, data });
  }

  async deleteTodo(where: Prisma.TodoWhereUniqueInput): Promise<Todo> {
    return this.prisma.todo.delete({ where });
  }
}

const todoService = new TodoService();
export default todoService;
