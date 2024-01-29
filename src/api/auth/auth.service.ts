import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common/mail/mail.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisService } from 'src/common/redis/RedisService';
import { IJwtPayload } from 'src/common/types/Jwt-payload.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {}

  async checkLogedInUser(userIdx: number): Promise<IJwtPayload> {
    const findUserResult = await this.prismaService.account.findUnique({
      where: {
        id: userIdx,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!findUserResult) {
      throw new JsonWebTokenError('로그인 후 이용해주세요');
    }

    return {
      id: findUserResult.id,
      email: findUserResult.email,
    };
  }

  async generateAccessToken(jwtOption: IJwtPayload): Promise<string> {
    return this.jwtService.sign(jwtOption);
  }
}
