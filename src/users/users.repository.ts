import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersRepository } from './users.interface';

@Injectable()
export class UserRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findByUsername(username: string): Promise<Prisma.UserGetPayload<{
    include: { role: { select: { name: true } } };
  }> | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        role: {
          select: { name: true },
        },
      },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
