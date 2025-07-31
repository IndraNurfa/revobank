import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { AccountsModule } from 'src/accounts/accounts.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [AccountsModule, CommonModule],
  controllers: [TransactionsController],
  providers: [
    { provide: 'ITransactionsService', useClass: TransactionsService },
    { provide: 'ITransactionsRepository', useClass: TransactionsRepository },
  ],
})
export class TransactionsModule {}
