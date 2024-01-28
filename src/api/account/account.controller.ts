import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import { Response, query } from 'express';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { User } from 'src/common/decorator/user.decorator';
import { IAuth } from '../auth/interface/auth.interface';
import { FindLoginIdDto } from './dto/find-loginid.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IsNumber } from 'class-validator';
import { IAccount } from './interface/account.interface';
import { ModifyProfileDto } from './dto/modify-profile.dto';

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

  @Get('/duplicate/login-id/:loginId')
  async checkDuplicateLoginId(@Param('loginId') loginId: string) {
    await this.accountService.checkDuplicateLoginId(loginId);

    return ResponseEntity.SUCCESS('사용 가능한 아이디입니다');
  }

  @Get('/duplicate/email/:email')
  async checkDulicateEmail(@Param('email') email: string) {
    await this.accountService.checkDuplicateEmail(email);

    return ResponseEntity.SUCCESS('사용 가능한 이메일입니다');
  }

  @Get('/find-id')
  async findLoginId(@Query() query: FindLoginIdDto) {
    const foundLoginId = await this.accountService.findLoginId(query);

    return ResponseEntity.SUCCESS_WITH(foundLoginId);
  }

  // 비밀번호 1차 고민중

  @Put('/reset/password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.accountService.resetPassword(body);

    return ResponseEntity.SUCCESS('비밀번호 수정 썽공');
  }

  @Get('/:userIdx')
  async getUserProfile(@Param('userIdx', ParseIntPipe) userIdx: number) {
    const userProfile = await this.accountService.getUserProfile(userIdx);

    return ResponseEntity.SUCCESS_WITH(userProfile);
  }

  @Put('/')
  @UseGuards(JwtAccessGuard)
  async modifyUserProfile(
    @Body() body: ModifyProfileDto,
    @User() user: IAuth.IJwtPayload,
  ) {
    await this.accountService.modifyUserProfile(body, user);

    return ResponseEntity.SUCCESS('수정 성공요');
  }
}
