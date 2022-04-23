import { join } from "path";
import { connectionPlugin, makeSchema } from "nexus";
import * as types from "./graphql";

export const schema = makeSchema({
  types,
  plugins: [
    connectionPlugin({
      cursorFromNode: (node) => node.id,
    }),
  ],
  nonNullDefaults: {
    input: true,
    output: true,
  },
  outputs: {
    typegen: join(__dirname, "/generated/nexus-typegen.ts"),
    schema: join(__dirname, "../schema.graphql"),
  },
  contextType: {
    module: join(__dirname, "types/index.d.ts"),
    export: "GraphQLContext",
  },
});
