import { objectType } from "nexus";

export const AuthTokens = objectType({
  name: "AuthTokens",
  definition(t) {
    t.string("accessToken");
    t.string("refreshToken");
  },
});
