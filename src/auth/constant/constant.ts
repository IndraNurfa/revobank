export const jwtConstants = {
  secret: process.env.APP_SECRET || 'superSecretKey',
  access_token_expires: '1d',
  refresh_token_expires: '7d',
};
