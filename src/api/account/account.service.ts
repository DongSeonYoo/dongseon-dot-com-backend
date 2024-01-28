import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignupRequestDto } from './dto/signup.dto';
import { SigninRequestDto } from './dto/signin.dto';
import { IAccount } from './interface/account.interface';
import { AuthService } from '../auth/auth.service';
import { PROVIDER } from './account-provider.enum';
import { IAuth } from '../auth/interface/auth.interface';
import { FindLoginIdDto } from './dto/find-loginid.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
        deletedAt: null,
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
        deletedAt: null,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('해당하는 사용자가 존재하지 않습니다');
    }

    return foundUser;
  }

  async deleteUser(user: IAuth.IJwtPayload): Promise<void> {
    const foundUser = await this.findUserByIdx(user.id);

    await this.prismaService.account.update({
      data: {
        loginId: foundUser.loginId,
        email: foundUser.email,
        deletedAt: new Date(),
      },
      where: {
        id: user.id,
      },
      select: {},
    });
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

  async checkDuplicateEmail(email: string) {
    const foundAccount = await this.prismaService.account.findUnique({
      where: {
        email,
      },
    });

    if (foundAccount) {
      throw new BadRequestException('해당하는 이메일이 이미 존재합니다');
    }
  }

  async findLoginId(
    findLoginIdDto: FindLoginIdDto,
  ): Promise<IAccount.IFindLoginIdResponse> {
    const foundLoginId = await this.prismaService.account.findUnique({
      where: {
        ...findLoginIdDto,
        deletedAt: null,
      },
      select: {
        loginId: true,
      },
    });

    if (!foundLoginId) {
      throw new NotFoundException('해당하는 회원이 존재하지 않습니다');
    }

    return foundLoginId;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.findUserByIdx(resetPasswordDto.userIdx);

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.prismaService.account.update({
      where: {
        id: resetPasswordDto.userIdx,
      },
      data: {
        password: hashedPassword,
      },
    });
  }
}
