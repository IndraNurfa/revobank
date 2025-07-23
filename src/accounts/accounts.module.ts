import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [AccountsController],
  providers: [AccountsService, JwtService],
})
export class AccountsModule {}
