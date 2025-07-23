import { Module } from '@nestjs/common';
import { ReferenceGenerator } from './utils/generate-reference';
import { PasswordHash } from './utils/password-hash';
import { JwtHelpers } from './utils/jwt-helpers';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ReferenceGenerator, PasswordHash, JwtHelpers, JwtService],
  exports: [ReferenceGenerator, PasswordHash, JwtHelpers],
})
export class CommonModule {}
