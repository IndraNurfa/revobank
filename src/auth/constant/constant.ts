export const jwtConstants = {
  secret: process.env.APP_SECRET || 'superSecretKey',
  access_token_expires: '15m',
  refresh_token_expires: '7d',
};
