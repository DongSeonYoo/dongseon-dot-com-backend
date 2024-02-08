import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  SignupRequestDto as SignupRequestDto,
  SignupResponseDto,
} from './dto/signup.dto';
import { SigninRequestDto, SigninResponseDto } from './dto/signin.dto';
import { ResponseEntity } from 'src/common/common-response';
import { Request, Response } from 'express';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { User } from 'src/common/decorator/user.decorator';
import { FindLoginIdDto } from './dto/find-loginid.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ModifyProfileDto } from './dto/modify-profile.dto';
import { IJwtPayload } from 'src/common/types/Jwt-payload.types';
import { AuthService } from '../auth/auth.service';
import { ViewDetailProfileResponseDto } from './dto/profile-detail.dto';
import { ViewUserProfileResponse } from './dto/view-profile.dto';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  @HttpCode(200)
  @ApiOperation({
    summary: '유저 생성(회원가입) api',
    description: '유저를 생성한다',
  })
  @ApiResponse({
    type: SignupResponseDto,
    description: '회원가입 성공',
    status: 200,
  })
  @ApiBody({ type: SignupRequestDto })
  async signup(@Body() body: SignupRequestDto, @Req() req: Request) {
    const signupResponse = await this.accountService.signup(body);

    return ResponseEntity.SUCCESS_WITH(signupResponse, '회원가입 성공요');
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({
    summary: '로그인 api',
    description: '로그인을 한다',
  })
  @ApiResponse({
    type: SigninResponseDto,
    description: '로그인 성공',
    status: 200,
  })
  @ApiBody({ type: SigninRequestDto })
  async login(
    @Body() body: SigninRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.accountService.signIn(body);
    res.cookie('accessToken', accessToken.accessToken);

    return ResponseEntity.SUCCESS_WITH(accessToken);
  }

  @Post('/logout')
  @UseGuards(JwtAccessGuard)
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: '로그아웃 api',
    description: 'response 헤더에 담겨있는 accessToken을 삭제한다',
  })
  @ApiResponse({
    description: '로그아웃 성공',
    status: 200,
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');

    return ResponseEntity.SUCCESS('로그아웃 성공요');
  }

  @Get('/detail')
  @UseGuards(JwtAccessGuard)
  @ApiOperation({
    summary: '사용자 프로필 조회',
    description: '로그인 한 사용자의 프로필을 보여줌',
  })
  @ApiResponse({
    type: ViewUserProfileResponse,
  })
  async viewDetailProfile(@User() user: IJwtPayload) {
    const profile = await this.accountService.viewDetailProfile(user);

    return ResponseEntity.SUCCESS_WITH(profile);
  }

  @Delete('/')
  @UseGuards(JwtAccessGuard)
  async deleteUser(
    @User() user: IJwtPayload,
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

  @Get('/duplicate/phone-number/:phoneNumber')
  async checkDuplicatePhoneNumber(@Param('phoneNumber') phoneNumber: string) {
    await this.accountService.checkDuplicatePhoneNumber(phoneNumber);

    return ResponseEntity.SUCCESS('사용 가능한 전화번호입니다');
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

  @Get('/profile/:userIdx')
  async getUserProfile(@Param('userIdx', ParseIntPipe) userIdx: number) {
    const userProfile = await this.accountService.getUserProfile(userIdx);

    return ResponseEntity.SUCCESS_WITH(userProfile);
  }

  @Put('/')
  @UseGuards(JwtAccessGuard)
  async modifyUserProfile(
    @Body() body: ModifyProfileDto,
    @User() user: IJwtPayload,
  ) {
    await this.accountService.modifyUserProfile(body, user);

    return ResponseEntity.SUCCESS('수정 성공요');
  }
}
