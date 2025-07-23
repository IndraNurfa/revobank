import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHelpers {
  constructor(private readonly jwtService: JwtService) {}

  async generate(
    id: number,
    username: string,
    full_name: string,
    role: string,
    expires: string,
    uuid: string,
  ): Promise<string> {
    const payload = { sub: id, username, full_name, role };

    const token = this.jwtService.signAsync(payload, {
      secret: process.env.APP_SECRET,
      jwtid: uuid,
      expiresIn: expires,
    });

    return token;
  }
}
