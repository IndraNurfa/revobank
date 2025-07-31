import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface IUsersService {
  create(dto: CreateUserDto): Promise<User>;
  findByUsername(username: string): Promise<
    Prisma.UserGetPayload<{
      include: { role: { select: { name: true } } };
    }>
  >;
  update(id: number, data: UpdateUserDto): Promise<User>;
}

export interface IUsersRepository {
  create(data: CreateUserDto): Promise<User>;
  findByUsername(username: string): Promise<
    Prisma.UserGetPayload<{
      include: { role: { select: { name: true } } };
    }>
  >;
  update(id: number, data: UpdateUserDto): Promise<User>;
}
