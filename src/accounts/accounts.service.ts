import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { RandomNumberGenerator } from 'src/common/utils/generate-reference';
import { IAccountsRepository, IAccountsService } from './accounts.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService implements IAccountsService {
  constructor(
    @Inject('IAccountsRepository')
    private readonly accountsRepo: IAccountsRepository,
    private readonly randomNumberGenerator: RandomNumberGenerator,
  ) {}

  async create(
    id: number,
    dto: CreateAccountDto,
  ): Promise<
    Prisma.AccountGetPayload<{
      include: { user: { select: { full_name: true } } };
    }>
  > {
    const account_number = this.randomNumberGenerator.generateAccountNumber();
    return await this.accountsRepo.create(id, account_number, dto);
  }

  async findByAccountNumber(id: string): Promise<Prisma.AccountGetPayload<{
    include: { user: { select: { full_name: true } } };
  }> | null> {
    const data = await this.accountsRepo.findByAccountNumber(id);

    if (!data) {
      throw new NotFoundException('account not found');
    }

    return data;
  }

  async findByUserId(user_id: number): Promise<
    Prisma.AccountGetPayload<{
      include: { user: { select: { full_name: true } } };
    }>[]
  > {
    return await this.accountsRepo.findByUserId(user_id);
  }

  async findAll(): Promise<
    Prisma.AccountGetPayload<{
      include: { user: { select: { full_name: true } } };
    }>[]
  > {
    return await this.accountsRepo.findAll();
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

    return await this.accountsRepo.updateAccount(id, sub, dto);
  }

  async remove(id: string): Promise<Account> {
    const existingAccount = await this.findByAccountNumber(id);

    if (existingAccount && existingAccount.balance.toNumber() > 0) {
      throw new BadRequestException('Account balance must be 0');
    }

    return await this.accountsRepo.deleteAccount(id);
  }
}
