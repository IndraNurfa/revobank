import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseRegisterDto } from './dto/resp-user.dto';
import { UserRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}

  async create(dto: CreateUserDto): Promise<ResponseRegisterDto> {
    return await this.userRepo.create(dto);
  }

  async findByUsername(username: string) {
    const data = await this.userRepo.findByUsername(username);
    console.log('data', data);
    return data;
  }

  async update(id: number, data: UpdateUserDto) {
    await this.userRepo.update(id, data);
  }
}
