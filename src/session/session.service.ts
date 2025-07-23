import { Injectable } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { SessionType } from './types/session';

@Injectable()
export class SessionService {
  constructor(private sessionRepo: SessionRepository) {}

  async create(data: SessionType) {
    return await this.sessionRepo.create(data);
  }

  async findOne(jti: string) {
    return await this.sessionRepo.findOne(jti);
  }

  async updateToken(jti: string, token: string) {
    return await this.sessionRepo.updateToken(jti, token);
  }
}
