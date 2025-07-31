import { Account, Prisma } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

export interface IAccountsService {
  create(
    id: number,
    dto: CreateAccountDto,
  ): Promise<
    Prisma.AccountGetPayload<{
      include: { user: { select: { full_name: true } } };
    }>
  >;
  findByAccountNumber(id: string): Promise<Prisma.AccountGetPayload<{
    include: { user: { select: { full_name: true } } };
  }> | null>;
  findByUserId(user_id: number): Promise<
    Prisma.AccountGetPayload<{
      include: { user: { select: { full_name: true } } };
    }>[]
  >;
  findAll(): Promise<
    Prisma.AccountGetPayload<{
      include: { user: { select: { full_name: true } } };
    }>[]
  >;
  update(id: string, sub: number, dto: UpdateAccountDto): Promise<Account>;
  remove(id: string): Promise<Account>;
}

export interface IAccountsRepository {
  create(
    user_id: number,
    account_number: string,
    dto: CreateAccountDto,
  ): Promise<
    Prisma.AccountGetPayload<{
      include: { user: { select: { full_name: true } } };
    }>
  >;
  findByAccountNumber(
    account_number: string,
  ): Promise<Prisma.AccountGetPayload<{
    include: { user: { select: { full_name: true } } };
  }> | null>;
  findByUserId(user_id: number): Promise<
    Prisma.AccountGetPayload<{
      include: { user: { select: { full_name: true } } };
    }>[]
  >;
  findAll(): Promise<
    Prisma.AccountGetPayload<{
      include: { user: { select: { full_name: true } } };
    }>[]
  >;
  updateAccount(
    account_number: string,
    user_id: number,
    dto: UpdateAccountDto,
  ): Promise<Account>;
  deleteAccount(account_number: string): Promise<Account>;
  updateBalance(
    tx: Prisma.TransactionClient,
    account_number: string,
    amount: Prisma.Decimal | number,
  ): Promise<Account>;
}
