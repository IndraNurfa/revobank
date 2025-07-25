import { SessionType } from './types/session';

export interface ISessionService {
  create(data: SessionType);
  findOne(jti: string);
  updateToken(jti: string, token: string);
  revokeToken(jti: string);
}

export interface ISessionRepository {
  create(data: SessionType);
  findOne(jti: string);
  updateToken(jti: string, token: string);
  revokeToken(jti: string);
}
