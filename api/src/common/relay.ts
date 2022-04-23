import { UserInputError } from "apollo-server-express";
import { PaginationArgs } from "nexus/dist/plugins/connectionPlugin";

// Custon error for pagination
export class PaginationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaginationError";
  }
}

export function parsePaginationArgs(args: PaginationArgs) {
  try {
    return relayToPrismaPagination(args);
  } catch (e) {
    if (e instanceof PaginationError) {
      throw new UserInputError(e.message);
    }
    throw e;
  }
}

// Original source: https://github.com/prisma-labs/nextjs-graphql-api-examples/blob/main/packages/graphql-with-prisma-relay/services/utils.ts
function relayToPrismaPagination(args: PaginationArgs): {
  cursor?: { id: string };
  take?: number;
  skip?: number;
} {
  const { first, last, before, after } = args;

  /**
   * This is currently only possible with js transformation on the result. eg:
   * after: 1, last: 1
   * ({
   *   cursor: { id: $before },
   *   take: Number.MAX_SAFE_INTEGER,
   *   skip: 1
   * }).slice(length - $last, length)
   */
  if (after && last) {
    throw new PaginationError(
      '"after" and "last" arguments can not be set simultaneously'
    );
  }

  /**
   * This is currently only possible with js transformation on the result. eg:
   * before: 4, first: 1
   * ({
   *   cursor: { id: $before },
   *   take: Number.MIN_SAFE_INTEGER,
   *   skip: 1
   * }).slice(0, $first)
   */
  if (before && first) {
    throw new PaginationError(
      '"before" and "first" arguments can not be set simultaneously'
    );
  }

  // Edge-case: simulates a single "before" with a hack
  if (before && !first && !last && !after) {
    return {
      cursor: { id: before },
      skip: 1,
      take: Number.MIN_SAFE_INTEGER,
    };
  }

  const take = resolveTake(first, last);
  const cursor = resolveCursor(before, after);
  const skip = resolveSkip(cursor);

  const newArgs = {
    take,
    cursor,
    skip,
  };

  return newArgs;
}

function resolveTake(
  first: number | null | undefined,
  last: number | null | undefined
): number | undefined {
  if (first && last) {
    throw new PaginationError(
      '"first" and "last" arguments can not be set simultaneously'
    );
  }

  if (!first && !last) {
    throw new PaginationError(
      'Pagination arguments must have "first" or "last" set'
    );
  }

  if (first) {
    if (first < 0) {
      throw new PaginationError('"first" can\'t be negative');
    }
    return first + 1; // Important to always fetch one more item so that we can know if there's a next page
  }

  if (last) {
    if (last < 0) {
      throw new PaginationError('"last" can\'t be negative');
    }

    if (last === 0) {
      return 0;
    }

    return (last + 1) * -1; // Important to always fetch one more item so that we can know if there's a previous page
  }

  return undefined;
}

function resolveCursor(
  before: string | null | undefined,
  after: string | null | undefined
) {
  if (before && after) {
    throw new PaginationError(
      '"before" and "after" arguments can not be set simultaneously'
    );
  }

  if (before) {
    return { id: before };
  }

  if (after) {
    return { id: after };
  }

  return undefined;
}

function resolveSkip(cursor: { id: string } | null | undefined) {
  if (cursor) {
    return 1;
  }

  return undefined;
}
