import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constant/constant';
import { Auth } from './types/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: Auth) {
    try {
      const { id, username, role } = payload;
      if (!id || !username) {
        throw new UnauthorizedException('Invalid token payload');
      }
      return { username, id, role };
    } catch (error) {
      this.logger.error('JWT validation error:', error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
