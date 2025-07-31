import { Injectable } from '@nestjs/common';
import { IAppService } from './app.interface';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService implements IAppService {
  constructor(private prisma: PrismaService) {}

  async getHealthCheck(): Promise<string> {
    return (await this.prisma.$queryRaw`SELECT 1`)
      ? 'Database OK!'
      : 'Database Down!';
  }
}
