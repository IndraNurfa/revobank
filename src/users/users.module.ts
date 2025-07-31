import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: 'IUsersService', useClass: UsersService },
    { provide: 'IUsersRepository', useClass: UserRepository },
    JwtService,
  ],
  exports: ['IUsersService', 'IUsersRepository'],
})
export class UsersModule {}
