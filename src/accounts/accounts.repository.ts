import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountType } from '@prisma/client';

@Injectable()
export class AccountRepository {
  constructor(private prisma: PrismaService) {}

  async create(user_id: number, account_number: string, dto: CreateAccountDto) {
    return await this.prisma.account.create({
      data: {
        user_id,
        account_number,
        account_name: dto.account_name,
        account_type: dto.account_type as AccountType,
      },
      include: {
        user: true,
      },
    });
  }

  async findByAccountNumber(account_number: string) {
    return await this.prisma.account.findFirst({
      where: { account_number, deleted_at: null },
      include: {
        user: true,
      },
    });
  }

  async findByUserId(user_id: number) {
    return await this.prisma.account.findMany({
      where: { user_id, deleted_at: null },
      include: {
        user: true,
      },
    });
  }

  async deleteAccount(account_number: string) {
    return await this.prisma.account.update({
      where: { account_number },
      data: { deleted_at: new Date() },
    });
  }
}
