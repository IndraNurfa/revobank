export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'superSecretKey',
  access_token_expires: process.env.ACCESS_TOKEN_EXP || '1d',
  refresh_token_expires: process.env.REFRESH_TOKEN_EXP || '7d',
};
