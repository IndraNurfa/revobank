import { Inject, Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { IAccountsRepository } from 'src/accounts/accounts.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITransactionsRepository } from './transactions.interface';

@Injectable()
export class TransactionsRepository implements ITransactionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('IAccountsRepository')
    private readonly accountRepo: IAccountsRepository,
  ) {}

  async debit(
    prisma: Prisma.TransactionClient,
    account_id: number,
    reference_id: string,
    amount: number,
  ): Promise<void> {
    await prisma.accountTransaction.create({
      data: {
        account_id,
        reference_id,
        amount,
        account_transaction_type: 'DEBIT',
      },
    });
  }

  async credit(
    prisma: Prisma.TransactionClient,
    account_id: number,
    reference_id: string,
    amount: Prisma.Decimal | number,
  ): Promise<void> {
    await prisma.accountTransaction.create({
      data: {
        account_id,
        reference_id,
        amount,
        account_transaction_type: 'CREDIT',
      },
    });
  }

  async deposit(
    account_id: number,
    reference_id: string,
    data: {
      receiver_account: string;
      amount: Prisma.Decimal | number;
      description?: string;
      additional_info?: Prisma.InputJsonValue;
    },
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          account_id,
          reference_id,
          amount: data.amount,
          transaction_type: 'TOPUP',
          transaction_status: 'PENDING',
          description: data.description,
          additional_info: data.additional_info ?? {},
        },
      });

      await Promise.all([
        this.credit(tx, account_id, reference_id, data.amount),
        this.accountRepo.updateBalance(tx, data.receiver_account, data.amount),
      ]);

      const updated = await tx.transaction.update({
        where: { reference_id },
        data: { transaction_status: 'SUCCESS' },
      });

      return updated;
    });
  }

  async withdraw(
    account_id: number,
    reference_id: string,
    data: {
      sender_account: string;
      amount: number;
      description?: string;
      additional_info?: Prisma.InputJsonValue;
    },
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          account_id,
          reference_id,
          amount: data.amount,
          transaction_type: 'WITHDRAWAL',
          transaction_status: 'PENDING',
          description: data.description,
          additional_info: data.additional_info ?? {},
        },
      });

      await Promise.all([
        this.debit(tx, account_id, reference_id, data.amount),
        this.accountRepo.updateBalance(tx, data.sender_account, -data.amount),
      ]);

      const updated = await tx.transaction.update({
        where: { reference_id },
        data: { transaction_status: 'SUCCESS' },
      });

      return updated;
    });
  }

  async transfer(
    sender_account_id: number,
    receiver_account_id: number,
    reference_id: string,
    data: {
      sender_account: string;
      receiver_account: string;
      amount: number;
      description?: string;
      additional_info?: Prisma.InputJsonValue;
    },
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          account_id: sender_account_id,
          reference_id,
          amount: data.amount,
          transaction_type: 'TRANSFER',
          transaction_status: 'PENDING',
          description: data.description,
          additional_info: data.additional_info ?? {},
        },
      });

      // remove balance from sender account
      await Promise.all([
        this.debit(tx, sender_account_id, reference_id, data.amount),
        this.accountRepo.updateBalance(tx, data.sender_account, -data.amount),
      ]);

      // increase balance to receiver account
      await Promise.all([
        this.credit(tx, receiver_account_id, reference_id, data.amount),
        this.accountRepo.updateBalance(tx, data.receiver_account, data.amount),
      ]);

      const updated = await tx.transaction.update({
        where: { reference_id },
        data: { transaction_status: 'SUCCESS' },
      });

      return updated;
    });
  }

  async findOne(reference_id: string): Promise<Prisma.TransactionGetPayload<{
    include: {
      account_transactions: {
        include: {
          account: {
            select: {
              account_name: true;
              account_number: true;
            };
          };
        };
      };
    };
  }> | null> {
    return await this.prisma.transaction.findFirst({
      where: { reference_id },
      include: {
        account_transactions: {
          include: {
            account: { select: { account_name: true, account_number: true } },
          },
        },
      },
    });
  }

  async findAllByUserId(user_id: number): Promise<
    Prisma.TransactionGetPayload<{
      include: {
        account_transactions: {
          include: {
            account: {
              select: {
                account_name: true;
                account_number: true;
              };
            };
          };
        };
      };
    }>[]
  > {
    return await this.prisma.transaction.findMany({
      where: { account: { user_id } },
      include: {
        account_transactions: {
          include: {
            account: { select: { account_name: true, account_number: true } },
          },
        },
      },
    });
  }

  async findAll(
    limit: number,
    offset: number,
  ): Promise<
    Prisma.TransactionGetPayload<{
      include: {
        account_transactions: {
          include: {
            account: {
              select: {
                account_name: true;
                account_number: true;
              };
            };
          };
        };
      };
    }>[]
  > {
    return await this.prisma.transaction.findMany({
      skip: limit,
      take: offset,
      orderBy: { created_at: 'desc' },
      include: {
        account_transactions: {
          include: {
            account: { select: { account_name: true, account_number: true } },
          },
        },
      },
    });
  }
}
