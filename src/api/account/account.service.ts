import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignupRequestDto } from './dto/signup.dto';
import { SigninRequestDto } from './dto/signin.dto';
import { IAccount } from './interface/account.interface';
import { AuthService } from '../auth/auth.service';
import { PROVIDER } from './account-provider.enum';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async signup(
    signupAccountDto: SignupRequestDto,
  ): Promise<IAccount.ISignupResponse> {
    await this.checkDuplicateLoginId(signupAccountDto.loginId);
    await this.checkDuplicateEmail(signupAccountDto.email);

    const hashedPassword = await bcrypt.hash(signupAccountDto.password, 10);

    const signupResult = await this.prismaService.account.create({
      data: {
        ...signupAccountDto,
        password: hashedPassword,
        provider: PROVIDER.LOCAL,
      },
      select: {
        id: true,
      },
    });

    return {
      userIdx: signupResult.id,
    };
  }

  async signIn(
    signinAccountDto: SigninRequestDto,
  ): Promise<IAccount.ISigninResponse> {
    const { loginId, password } = signinAccountDto;

    // 1. 해당하는 아이디를 가진 사용자가 있는지 확인
    const user = await this.prismaService.account.findUnique({
      where: {
        loginId,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new BadRequestException(
        '아이디 또는 비밀번호가 일치하지 않습니다(아이디 일치X)',
      );
    }

    // 2. 암호화된 비밀번호와 매칭
    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
      throw new BadRequestException(
        '아이디 또는 비밀번호가 일치하지 않습니다(비밀번호 일치X)',
      );
    }

    // accessToken 생성
    const accessToken = await this.authService.generateAccessToken(user);

    return { accessToken };
  }

  async findUserByIdx(userIdx: number) {
    const foundUser = await this.prismaService.account.findUnique({
      where: {
        id: userIdx,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('해당하는 사용자가 존재하지 않습니다');
    }

    return foundUser;
  }

  private async checkDuplicateEmail(email: string) {
    const foundAccount = await this.prismaService.account.findUnique({
      where: {
        email,
      },
    });

    if (foundAccount) {
      throw new BadRequestException('해당하는 이메일이 이미 존재합니다');
    }
  }

  async checkDuplicateLoginId(loginId: string) {
    const foundAccount = await this.prismaService.account.findUnique({
      where: {
        loginId,
      },
    });

    if (foundAccount) {
      throw new BadRequestException('해당하는 아이디가 이미 존재합니다');
    }
  }
}
