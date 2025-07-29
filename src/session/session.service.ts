import { Injectable } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { SessionType } from './types/session';
import { UserSession } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private sessionRepo: SessionRepository) {}

  async create(data: SessionType): Promise<UserSession> {
    return await this.sessionRepo.create(data);
  }

  async findOne(jti: string): Promise<UserSession | null> {
    return await this.sessionRepo.findOne(jti);
  }

  async updateToken(jti: string, token: string): Promise<UserSession> {
    return await this.sessionRepo.updateToken(jti, token);
  }

  async revokeToken(jti: string): Promise<UserSession> {
    return await this.sessionRepo.revokeToken(jti);
  }
}
