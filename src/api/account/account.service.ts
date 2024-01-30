import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignupRequestDto, SignupResponseDto } from './dto/signup.dto';
import { SigninRequestDto, SigninResponseDto } from './dto/signin.dto';
import { AuthService } from '../auth/auth.service';
import { PROVIDER } from './account-provider.enum';
import { FindLoginIdDto, FindLoginIdResponseDto } from './dto/find-loginid.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ModifyProfileDto } from './dto/modify-profile.dto';
import { ViewUserProfileResponse } from './dto/view-profile.dto';
import { IJwtPayload } from 'src/common/types/Jwt-payload.types';
import { ViewDetailProfileResponseDto } from './dto/profile-detail.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async signup(signupAccountDto: SignupRequestDto): Promise<SignupResponseDto> {
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

  async signIn(signinAccountDto: SigninRequestDto): Promise<SigninResponseDto> {
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

  async viewDetailProfile(
    user: IJwtPayload,
  ): Promise<ViewDetailProfileResponseDto> {
    const userInfo = await this.prismaService.account.findUniqueOrThrow({
      where: {
        id: user.id,
      },
    });

    return {
      loginId: userInfo.loginId,
      email: userInfo.email,
      name: userInfo.name,
      phoneNumber: userInfo.phoneNumber,
      profileImg: userInfo.profileImg,
      updatedAt: userInfo.updatedAt,
      createdAt: userInfo.createdAt,
      deletedAt: userInfo.deletedAt,
    };
  }

  async deleteUser(user: IJwtPayload): Promise<void> {
    await this.prismaService.account.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: user.id,
      },
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

  async checkDuplicatePhoneNumber(phoneNumber: string): Promise<void> {
    const foundPhoneNumber = await this.prismaService.account.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
      select: {
        phoneNumber: true,
      },
    });

    if (foundPhoneNumber) {
      throw new BadRequestException('이미 존재하는 전화번호입니다');
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
  ): Promise<FindLoginIdResponseDto> {
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

    return {
      loginId: foundLoginId.loginId,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.prismaService.account.update({
      data: {
        password: hashedPassword,
      },
      where: {
        id: resetPasswordDto.userIdx,
      },
    });
  }

  async getUserProfile(userIdx: number): Promise<ViewUserProfileResponse> {
    const result = await this.prismaService.account.findUnique({
      where: {
        id: userIdx,
        deletedAt: null,
      },
      select: {
        loginId: true,
        name: true,
        email: true,
        createdAt: true,
        profileImg: true,
      },
    });

    if (!result) {
      throw new BadRequestException('해당하는 사용자가 존재하지 않습니다');
    }

    return {
      loginId: result.loginId,
      name: result.name,
      email: result.email,
      createdAt: result.createdAt,
      profileImg: result.profileImg,
    };
  }

  async modifyUserProfile(
    modifyProfileDto: ModifyProfileDto,
    user: IJwtPayload,
  ) {
    await this.prismaService.account.update({
      where: {
        id: user.id,
      },
      data: {
        ...modifyProfileDto,
      },
    });
  }

  async sendVerifyCode(email: string) {
    this.authService;
  }
}
