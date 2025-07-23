import { Injectable, NotFoundException } from '@nestjs/common';
import { RandomNumberGenerator } from 'src/common/utils/generate-reference';
import { AccountRepository } from './accounts.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    private accountRepo: AccountRepository,
    private readonly randomNumberGenerator: RandomNumberGenerator,
  ) {}

  async create(id: number, dto: CreateAccountDto) {
    const account_number = this.randomNumberGenerator.generateAccountNumber();
    return await this.accountRepo.create(id, account_number, dto);
  }

  async findByAccountNumber(id: string) {
    const data = await this.accountRepo.findByAccountNumber(id);
    if (data === null) {
      throw new NotFoundException('account not found');
    }
    return data;
  }

  async findByUserId(user_id: number) {
    return await this.accountRepo.findByUserId(user_id);
  }

  update(id: string, dto: UpdateAccountDto) {
    return `This action updates a #${id} account.`;
  }

  async remove(id: string) {
    await this.findByAccountNumber(id);
    return await this.accountRepo.deleteAccount(id);
  }
}
