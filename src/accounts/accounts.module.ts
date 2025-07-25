import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { AccountRepository } from './accounts.repository';

@Module({
  imports: [CommonModule],
  controllers: [AccountsController],
  providers: [AccountsService, JwtService, AccountRepository],
  exports: [AccountsService, AccountRepository],
})
export class AccountsModule {}
