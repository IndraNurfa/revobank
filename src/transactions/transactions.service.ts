import { BadRequestException, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { AccountsService } from 'src/accounts/accounts.service';
import { RandomNumberGenerator } from 'src/common/utils/generate-reference';
import {
  DepositTransactionDto,
  TransferTransactionDto,
  WithdrawTransactionDto,
} from './dto/create-transaction.dto';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepo: TransactionsRepository,
    private readonly accountService: AccountsService,
    private readonly randomNumberGenerator: RandomNumberGenerator,
  ) {}

  findAll() {
    return `This action returns all transactions`;
  }

  async findAllByUserId(sub: number) {
    return await this.transactionRepo.findAllByUserId(sub);
  }

  async findOne(id: string) {
    return await this.transactionRepo.findOne(id);
  }

  async deposit(user_id: number, dto: DepositTransactionDto) {
    const userAccount = await this.accountService.findByAccountNumber(
      dto.receiver_account,
    );

    if (userAccount.user_id !== user_id) {
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

  async withdraw(user_id: number, dto: WithdrawTransactionDto) {
    const userAccount = await this.accountService.findByAccountNumber(
      dto.sender_account,
    );

    if (userAccount.user_id !== user_id) {
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

  async transfer(user_id: number, dto: TransferTransactionDto) {
    const [sender_account, receiver_account] = await Promise.all([
      await this.accountService.findByAccountNumber(dto.sender_account),
      await this.accountService.findByAccountNumber(dto.receiver_account),
    ]);

    if (sender_account.user_id !== user_id) {
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
