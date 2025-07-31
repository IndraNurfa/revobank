import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersRepository, IUsersService } from './users.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly userRepo: IUsersRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return await this.userRepo.create(dto);
  }

  async findByUsername(username: string): Promise<
    Prisma.UserGetPayload<{
      include: { role: { select: { name: true } } };
    }>
  > {
    return await this.userRepo.findByUsername(username);
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return await this.userRepo.update(id, data);
  }
}
