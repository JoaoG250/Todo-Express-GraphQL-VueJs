import { join } from "path";
import { connectionPlugin, makeSchema } from "nexus";

export const schema = makeSchema({
  types: [],
  plugins: [
    connectionPlugin({
      cursorFromNode: (node) => node.id,
    }),
  ],
  outputs: {
    typegen: join(__dirname, "/generated/nexus-typegen.ts"),
    schema: join(__dirname, "../schema.graphql"),
  },
  contextType: {
    module: join(__dirname, "@types/index.d.ts"),
    export: "Context",
  },
});
