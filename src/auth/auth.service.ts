import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { SessionService } from 'src/session/session.service';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constant/constant';
import { LoginDto, RegisterDto } from './dto/req-auth.dto';
import { ResponseLoginDto, ResponseRegisterDto } from './dto/resp-auth.dto';
import { JwtHelpers } from 'src/common/utils/jwt-helpers';
import { TokenPayload } from './types/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly JwtHelpers: JwtHelpers,
    private readonly sessionService: SessionService,
  ) {}

  async register(dto: RegisterDto): Promise<ResponseRegisterDto> {
    const hash = await bcrypt.hash(dto.password, 10);
    const dob = new Date(dto.dob);

    dto.password = hash;
    dto.dob = dob;

    return await this.userService.create(dto);
  }

  async login(dto: LoginDto): Promise<ResponseLoginDto | null> {
    const existingUser = await this.userService.findByUsername(dto.username);

    if (!existingUser) {
      throw new UnauthorizedException('username or password is invalid.');
    }

    const plaintextPassword = dto.password;
    const hashFromDb = existingUser.password;

    const isPasswordMatching = await bcrypt.compare(
      plaintextPassword,
      hashFromDb,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('username or password is invalid.');
    }

    const uuid = randomUUID();

    const [access_token, refresh_token] = await Promise.all([
      this.JwtHelpers.generate(
        existingUser.id,
        existingUser.username,
        existingUser.full_name,
        existingUser.role.name,
        jwtConstants.access_token_expires,
        uuid,
      ),
      this.JwtHelpers.generate(
        existingUser.id,
        existingUser.username,
        existingUser.full_name,
        existingUser.role.name,
        jwtConstants.refresh_token_expires,
        uuid,
      ),
    ]);

    const [hash_token, hash_refresh_token] = await Promise.all([
      await bcrypt.hash(access_token, 10),
      await bcrypt.hash(refresh_token, 10),
    ]);

    await this.sessionService.create({
      user_id: existingUser.id,
      jti: uuid,
      token: hash_token,
      refresh_token: hash_refresh_token,
      token_expired: new Date(Date.now() + 15 * 60 * 1000),
      refresh_token_expired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      ...existingUser,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async refreshToken(data: TokenPayload) {
    const { sub, username, full_name, role, jti } = data;
    console.log(data);

    const access_token = await this.JwtHelpers.generate(
      sub,
      username,
      full_name,
      role,
      jwtConstants.access_token_expires,
      jti,
    );

    const hashToken = await bcrypt.hash(access_token, 10);

    const updateSession = await this.sessionService.updateToken(jti, hashToken);

    if (!updateSession) {
      throw new InternalServerErrorException('Failed to update access token');
    }

    return access_token;
  }
}
