import { Prisma, Transaction } from '@prisma/client';
import {
  DepositTransactionDto,
  TransferTransactionDto,
  WithdrawTransactionDto,
} from './dto/create-transaction.dto';

export interface ITransactionsService {
  findAll(
    limit: number,
    offset: number,
  ): Promise<
    Prisma.TransactionGetPayload<{
      include: {
        account_transactions: {
          select: {
            account_transaction_type: true;
          };
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
  >;
  findAllByUserId(sub: number): Promise<
    Prisma.TransactionGetPayload<{
      include: {
        account_transactions: {
          select: {
            account_transaction_type: true;
          };
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
  >;
  findOne(id: string): Promise<Prisma.TransactionGetPayload<{
    include: {
      account_transactions: {
        select: {
          account_transaction_type: true;
        };
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
  }> | null>;
  deposit(user_id: number, dto: DepositTransactionDto): Promise<Transaction>;
  withdraw(user_id: number, dto: WithdrawTransactionDto): Promise<Transaction>;
  transfer(user_id: number, dto: TransferTransactionDto): Promise<Transaction>;
}

export interface ITransactionsRepository {
  debit(
    prisma: Prisma.TransactionClient,
    account_id: number,
    reference_id: string,
    amount: number,
  ): Promise<void>;
  credit(
    prisma: Prisma.TransactionClient,
    account_id: number,
    reference_id: string,
    amount: Prisma.Decimal | number,
  ): Promise<void>;
  deposit(
    account_id: number,
    reference_id: string,
    data: {
      receiver_account: string;
      amount: Prisma.Decimal | number;
      description?: string;
      additional_info?: Prisma.InputJsonValue;
    },
  ): Promise<Transaction>;
  transfer(
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
  ): Promise<Transaction>;
  withdraw(
    account_id: number,
    reference_id: string,
    data: {
      sender_account: string;
      amount: number;
      description?: string;
      additional_info?: Prisma.InputJsonValue;
    },
  ): Promise<Transaction>;
  findAllByUserId(user_id: number): Promise<
    Prisma.TransactionGetPayload<{
      include: {
        account_transactions: {
          select: {
            account_transaction_type: true;
          };
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
  >;
  findOne(reference_id: string): Promise<Prisma.TransactionGetPayload<{
    include: {
      account_transactions: {
        select: {
          account_transaction_type: true;
        };
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
  }> | null>;
  findAll(
    limit: number,
    offset: number,
  ): Promise<
    Prisma.TransactionGetPayload<{
      include: {
        account_transactions: {
          select: {
            account_transaction_type: true;
          };
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
  >;
}
