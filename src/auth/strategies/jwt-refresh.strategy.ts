import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ISessionService } from 'src/session/session.interface';
import { TokenPayload } from '../types/auth';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    @Inject('ISessionService')
    private readonly sessionService: ISessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'super-secret-key',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload): Promise<TokenPayload> {
    const authHeader = req.headers['authorization'] as string;
    const token =
      typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined;

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const jti = payload.jti;

    const session = await this.sessionService.findOne(jti);

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const isMatch = await bcrypt.compare(token, session.refresh_token);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid token');
    }

    // Remove password from user object before returning
    return {
      sub: payload.sub,
      username: payload.username,
      full_name: payload.full_name,
      role: payload.role,
      jti: payload.jti,
    };
  }
}
