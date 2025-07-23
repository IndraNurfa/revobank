import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { SessionService } from './session/session.service';
import { SessionModule } from './session/session.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    PrismaModule,
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    UsersModule,
    AuthModule,
    SessionModule,
    AccountsModule,
    TransactionsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, SessionService],
})
export class AppModule {}
