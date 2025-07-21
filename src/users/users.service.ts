import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseRegisterDto } from './dto/resp-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}

  async create(dto: CreateUserDto): Promise<ResponseRegisterDto> {
    return await this.userRepo.create(dto);
  }

  async findByUsername(username: string) {
    return await this.userRepo.findByUsername(username);
  }
}
