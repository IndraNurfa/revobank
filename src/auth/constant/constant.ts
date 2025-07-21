export const jwtConstants = {
  secret: process.env.APP_SECRET || 'superSecretKey', // (or you can use process.env.JWT_SECRET and store in .env)
};
