import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHealthCheck(): Promise<string> {
    return (await this.prisma.$queryRaw`SELECT 1`)
      ? 'Database OK!'
      : 'Database Down!';
  }
}
