import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { AccountsController } from './accounts.controller';
import { AccountsRepository } from './accounts.repository';
import { AccountsService } from './accounts.service';

@Module({
  imports: [CommonModule],
  controllers: [AccountsController],
  providers: [
    { provide: 'IAccountsService', useClass: AccountsService },
    { provide: 'IAccountsRepository', useClass: AccountsRepository },
    JwtService,
  ],
  exports: ['IAccountsService', 'IAccountsRepository'],
})
export class AccountsModule {}
