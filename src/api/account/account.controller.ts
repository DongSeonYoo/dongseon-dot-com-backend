import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SignupRequestDto as SignupRequestDto,
  SignupResponseDto,
} from './dto/signup.dto';
import { SigninRequestDto } from './dto/signin.dto';
import { ResponseEntity } from 'src/common/dto/common-response.dto';
import { Response } from 'express';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { User } from 'src/common/decorator/user.decorator';
import { IAuth } from '../auth/interface/auth.interface';

@ApiTags('account Api')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiResponse({ type: SignupResponseDto })
  @Post('/signup')
  async signup(@Body() body: SignupRequestDto) {
    const signupResponse = await this.accountService.signup(body);

    return ResponseEntity.SUCCESS_WITH(signupResponse, '회원가입 성공요');
  }

  @Post('/login')
  async login(
    @Body() body: SigninRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.accountService.signIn(body);
    res.cookie('accessToken', accessToken);

    return ResponseEntity.SUCCESS();
  }

  @Post('/logout')
  @UseGuards(JwtAccessGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');

    return ResponseEntity.SUCCESS('로그아웃 성공요');
  }

  @Delete('/')
  @UseGuards(JwtAccessGuard)
  async deleteUser(
    @User() user: IAuth.IJwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.accountService.deleteUser(user);

    return ResponseEntity.SUCCESS('회원탈퇴 성공요');
  }

  @Get('/duplicate/:loginId')
  async checkDuplicateLoginId(@Param('loginId') loginId: string) {
    await this.accountService.checkDuplicateLoginId(loginId);

    return ResponseEntity.SUCCESS('사용 가능한 아이디입니다');
  }
}
