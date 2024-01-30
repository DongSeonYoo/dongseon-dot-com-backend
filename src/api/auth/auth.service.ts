import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common/mail/mail.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { IJwtPayload } from 'src/common/types/Jwt-payload.types';
import { RedisService } from 'src/common/redis/redis.service';
import { CheckAuthCodeDto } from './dto/check-auth-code.dto';
import { SendAuthEmailDto } from './dto/send-auth-email.dto';

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

  async sendVerifyCode(dto: SendAuthEmailDto) {
    // generate auth code
    const authCode = Math.floor(Math.random() * 89999) + 10000;

    await this.mailService.sendWelcomeMail(dto, authCode);

    await this.redisService.setAuthCode(dto.email, authCode);
  }

  async checkVerifyCode(dto: CheckAuthCodeDto) {
    const code = (await this.redisService.getAuthCode(dto.email)) as
      | number
      | undefined;

    if (!code) {
      throw new BadRequestException('인증번호가 만료되었습니다');
    }

    if (code !== dto.code) {
      throw new BadRequestException('인증에 실패하였습니다');
    }

    await this.redisService.deleteCode(dto.email);
  }
}
