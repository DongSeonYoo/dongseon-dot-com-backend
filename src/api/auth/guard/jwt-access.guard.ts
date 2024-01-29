import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { error } from 'console';
import { Response } from 'express';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (!user) {
      const response: Response = context.switchToHttp().getResponse();
      response.clearCookie('accessToken');
      throw new UnauthorizedException('로그인 후 이용가능합니다');
    }

    return user;
  }
}
