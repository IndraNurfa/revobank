import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RandomNumberGenerator } from 'src/common/utils/generate-reference';
import { AccountRepository } from './accounts.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(
    private accountRepo: AccountRepository,
    private readonly randomNumberGenerator: RandomNumberGenerator,
  ) {}

  async create(id: number, dto: CreateAccountDto): Promise<Account> {
    const account_number = this.randomNumberGenerator.generateAccountNumber();
    return await this.accountRepo.create(id, account_number, dto);
  }

  async findByAccountNumber(id: string): Promise<Account> {
    const data = await this.accountRepo.findByAccountNumber(id);

    if (data === null) {
      throw new NotFoundException('account not found');
    }

    return data;
  }

  async findByUserId(user_id: number): Promise<Account[]> {
    return await this.accountRepo.findByUserId(user_id);
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepo.findAll();
  }

  async update(
    id: string,
    sub: number,
    dto: UpdateAccountDto,
  ): Promise<Account> {
    const existingAccount = await this.findByAccountNumber(id);

    if (existingAccount && existingAccount.user_id !== sub) {
      throw new BadRequestException('Account for this users not found');
    }

    return await this.accountRepo.updateAccount(id, sub, dto);
  }

  async remove(id: string): Promise<Account> {
    const existingAccount = await this.findByAccountNumber(id);

    if (existingAccount && existingAccount.balance.toNumber() > 0) {
      throw new BadRequestException('Account balance must be 0');
    }

    return await this.accountRepo.deleteAccount(id);
  }
}
