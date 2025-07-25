import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AccountRepository } from 'src/accounts/accounts.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsRepository {
  private logger = new Logger(TransactionsRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly accountRepo: AccountRepository,
  ) {}
  async debit(
    prisma: Prisma.TransactionClient,
    account_id: number,
    reference_id: string,
    amount: number,
  ) {
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
  ) {
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
  ) {
    return this.prisma
      .$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            account_id,
            reference_id,
            amount: data.amount,
            transaction_type: 'TOPUP',
            description: data.description,
            additional_info: data.additional_info ?? {},
          },
        });

        await Promise.all([
          this.credit(tx, account_id, reference_id, data.amount),
          this.accountRepo.updateBalance(
            tx,
            data.receiver_account,
            data.amount,
          ),
        ]);

        await tx.transaction.update({
          where: { reference_id },
          data: { transaction_status: 'SUCCESS' },
        });
      })
      .catch((err) => {
        this.logger.error('deposit failed', err);
        throw err;
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
  ) {
    return this.prisma
      .$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            account_id,
            reference_id,
            amount: data.amount,
            transaction_type: 'WITHDRAWAL',
            description: data.description,
            additional_info: data.additional_info ?? {},
          },
        });

        await Promise.all([
          this.debit(tx, account_id, reference_id, data.amount),
          this.accountRepo.updateBalance(tx, data.sender_account, -data.amount),
        ]);

        await tx.transaction.update({
          where: { reference_id },
          data: { transaction_status: 'SUCCESS' },
        });
      })
      .catch((err) => {
        this.logger.error('withdraw failed', err);
        throw err; // rethrow or handle gracefully
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
  ) {
    return this.prisma
      .$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            account_id: sender_account_id,
            reference_id,
            amount: data.amount,
            transaction_type: 'TRANSFER',
            description: data.description,
            additional_info: data.additional_info ?? {},
          },
        });

        //remove balance from sender account
        await Promise.all([
          this.debit(tx, sender_account_id, reference_id, data.amount),
          this.accountRepo.updateBalance(tx, data.sender_account, -data.amount),
        ]);

        //increase balance to receiver account
        await Promise.all([
          this.credit(tx, receiver_account_id, reference_id, data.amount),
          this.accountRepo.updateBalance(
            tx,
            data.receiver_account,
            data.amount,
          ),
        ]);

        await tx.transaction.update({
          where: { reference_id },
          data: { transaction_status: 'SUCCESS' },
        });
      })
      .catch((err) => {
        this.logger.error('Transaction failed', err);
        throw err; // rethrow or handle gracefully
      });
  }

  async findOne(reference_id: string) {
    return await this.prisma.transaction.findFirst({
      where: { reference_id },
      include: { account_transactions: { include: { account: true } } },
    });
  }

  async findAllByUserId(user_id: number) {
    return await this.prisma.transaction.findMany({
      where: { account: { user_id } },
      include: { account_transactions: { include: { account: true } } },
    });
  }
}
