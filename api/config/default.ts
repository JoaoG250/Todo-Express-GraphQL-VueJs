function getEnvironmentVariable(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export default {
  jwt: {
    accessTokenSecret: getEnvironmentVariable("JWT_ACCESS_TOKEN_SECRET"),
    accessTokenExpiresIn: 60 * 2,
    refreshTokenSecret: getEnvironmentVariable("JWT_REFRESH_TOKEN_SECRET"),
    refreshTokenExpiresIn: 60 * 60 * 24 * 1,
  },
  redis: {
    port: 6379,
    host: "redis",
    family: 4,
    defaultDatabase: 0,
    refreshTokenDatabase: 1,
  },
};
