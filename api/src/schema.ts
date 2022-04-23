import { join } from "path";
import { makeSchema } from "nexus";

export const schema = makeSchema({
  types: [],
  outputs: {
    typegen: join(__dirname, "/generated/nexus-typegen.ts"),
    schema: join(__dirname, "../schema.graphql"),
  },
});
