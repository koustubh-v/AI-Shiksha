import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.query?.token as string;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') || 'secretKey', // fallback for dev
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.username,
      role: payload.role?.toUpperCase(),
      franchise_id: payload.franchise_id || null,
    };
  }
}

