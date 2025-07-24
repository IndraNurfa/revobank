import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionType } from './types/session';

@Injectable()
export class SessionRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: SessionType) {
    return await this.prisma.userSession.create({
      data,
    });
  }

  async findOne(jti: string) {
    return await this.prisma.userSession.findUnique({
      where: { jti, revoked_at: null },
    });
  }

  async updateToken(jti: string, token: string) {
    return await this.prisma.userSession.update({
      where: { jti, revoked_at: null },
      data: {
        token,
        token_expired: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
  }

  async revokeToken(jti: string) {
    return await this.prisma.userSession.update({
      where: { jti, revoked_at: null },
      data: {
        revoked_at: new Date(),
      },
    });
  }
}
