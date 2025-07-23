import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionType } from './types/session';

@Injectable()
export class SessionRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: SessionType) {
    // user_id               Int
    // jti                   String    @unique @db.Uuid
    // token                 String
    // refresh_token         String
    // token_expired         DateTime
    // refresh_token_expired DateTime
    return await this.prisma.userSession.create({
      data,
    });
  }

  async findOne(jti: string) {
    return await this.prisma.userSession.findUnique({
      where: { jti },
    });
  }

  async updateToken(jti: string, token: string) {
    return await this.prisma.userSession.update({
      where: { jti },
      data: {
        token,
        token_expired: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
  }
}
