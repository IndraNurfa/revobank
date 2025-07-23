import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, JwtService],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
