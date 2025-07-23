import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RandomNumberGenerator } from './utils/generate-reference';
import { JwtHelpers } from './utils/jwt-helpers';
import { PasswordHash } from './utils/password-hash';

@Module({
  providers: [RandomNumberGenerator, PasswordHash, JwtHelpers, JwtService],
  exports: [RandomNumberGenerator, PasswordHash, JwtHelpers],
})
export class CommonModule {}
