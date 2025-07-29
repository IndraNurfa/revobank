import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    return await this.userRepo.create(dto);
  }

  async findByUsername(username: string): Promise<User & { role: Role }> {
    const data = await this.userRepo.findByUsername(username);
    console.log(data);
    return data;
  }

  async update(id: number, data: UpdateUserDto) {
    await this.userRepo.update(id, data);
  }
}
