import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/req-auth.dto';
import { ResponseLoginDto, ResponseRegisterDto } from './dto/resp-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
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

    console.log('existingUser : ', existingUser);

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
      throw new HttpException(
        'username or password is invalid.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { access_token, refresh_token } = await this.generateToken(
      existingUser.id,
      existingUser.username,
      existingUser.full_name,
      existingUser.role.name.toUpperCase(),
    );

    return {
      ...existingUser,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  private async generateToken(
    id: number,
    username: string,
    fullname: string,
    role: string,
  ) {
    const payload = { sub: id, username, fullname, role };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.APP_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.APP_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
