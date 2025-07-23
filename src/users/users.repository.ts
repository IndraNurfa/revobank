import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseRegisterDto } from './dto/resp-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<ResponseRegisterDto> {
    return this.prisma.user.create({
      data,
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { username },
      include: {
        role: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
