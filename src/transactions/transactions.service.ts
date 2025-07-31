import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
import { IAccountsService } from 'src/accounts/accounts.interface';
import { RandomNumberGenerator } from 'src/common/utils/generate-reference';
import {
  DepositTransactionDto,
  TransferTransactionDto,
  WithdrawTransactionDto,
} from './dto/create-transaction.dto';
import {
  ITransactionsRepository,
  ITransactionsService,
} from './transactions.interface';

@Injectable()
export class TransactionsService implements ITransactionsService {
  constructor(
    @Inject('IAccountsService')
    private readonly accountService: IAccountsService,
    @Inject('ITransactionsRepository')
    private readonly transactionRepo: ITransactionsRepository,
    private readonly randomNumberGenerator: RandomNumberGenerator,
  ) {}

  async findAll(
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
  > {
    return await this.transactionRepo.findAll(limit, offset);
  }

  async findAllByUserId(sub: number): Promise<
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
  > {
    return await this.transactionRepo.findAllByUserId(sub);
  }

  async findOne(id: string): Promise<Prisma.TransactionGetPayload<{
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
  }> | null> {
    const data = await this.transactionRepo.findOne(id);
    if (!data) {
      throw new BadRequestException('Transaction not found');
    }
    return data;
  }

  async deposit(
    user_id: number,
    dto: DepositTransactionDto,
  ): Promise<Transaction> {
    const userAccount = await this.accountService.findByAccountNumber(
      dto.receiver_account,
    );

    if (userAccount?.user_id !== user_id) {
      throw new BadRequestException(
        'The receiver account does not belong to the authenticated user.',
      );
    } else if (userAccount.id < 0 || userAccount === null) {
      throw new BadRequestException('Invalid receiver account number');
    }

    const reference_id = this.randomNumberGenerator.generateReference();

    const receiver_account = await this.accountService.findByAccountNumber(
      dto.receiver_account,
    );

    if (!receiver_account) {
      throw new BadRequestException('Receiver account not found');
    }

    const plainAdditionalInfo = dto.additional_info
      ? instanceToPlain(dto.additional_info)
      : undefined;

    const data = {
      receiver_account: dto.receiver_account,
      amount: dto.amount,
      description: `DEPOSIT-${reference_id}`,
      additional_info: plainAdditionalInfo,
    };

    return await this.transactionRepo.deposit(
      receiver_account.id,
      reference_id,
      data,
    );
  }

  async withdraw(
    user_id: number,
    dto: WithdrawTransactionDto,
  ): Promise<Transaction> {
    const userAccount = await this.accountService.findByAccountNumber(
      dto.sender_account,
    );

    if (userAccount?.user_id !== user_id) {
      throw new BadRequestException(
        'The sender account does not belong to the authenticated user.',
      );
    } else if (userAccount.id < 0 || userAccount === null) {
      throw new BadRequestException('Invalid sender account number');
    }

    const reference_id = this.randomNumberGenerator.generateReference();

    const plainAdditionalInfo = dto.additional_info
      ? instanceToPlain(dto.additional_info)
      : undefined;

    const data = {
      sender_account: dto.sender_account,
      amount: dto.amount,
      description: `WITHDRAWAL-${reference_id}`,
      additional_info: plainAdditionalInfo,
    };

    return await this.transactionRepo.withdraw(
      userAccount.id,
      reference_id,
      data,
    );
  }

  async transfer(
    user_id: number,
    dto: TransferTransactionDto,
  ): Promise<Transaction> {
    const [sender_account, receiver_account] = await Promise.all([
      await this.accountService.findByAccountNumber(dto.sender_account),
      await this.accountService.findByAccountNumber(dto.receiver_account),
    ]);

    if (!sender_account || !receiver_account) {
      throw new BadRequestException('Invalid account number');
    } else if (sender_account.user_id !== user_id) {
      throw new BadRequestException(
        'The sender account does not belong to the authenticated user.',
      );
    } else if ((sender_account.balance as unknown as number) - dto.amount < 0) {
      throw new BadRequestException(
        'Insufficient balance in the sender account.',
      );
    }

    const reference_id = this.randomNumberGenerator.generateReference();

    const plainAdditionalInfo = dto.additional_info
      ? instanceToPlain(dto.additional_info)
      : undefined;

    const data = {
      sender_account: sender_account.account_number,
      receiver_account: receiver_account.account_number,
      amount: dto.amount,
      description: `TRANSFER-${reference_id}`,
      additional_info: plainAdditionalInfo,
    };

    return await this.transactionRepo.transfer(
      sender_account.id,
      receiver_account.id,
      reference_id,
      data,
    );
  }
}
