import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SignupRequestDto as SignupRequestDto,
  SignupResponseDto,
} from './dto/signup.dto';
import { SigninRequestDto } from './dto/signin.dto';
import { ResponseEntity } from 'src/common/dto/common-response.dto';
import { Response } from 'express';

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
    res.cookie('access_token', accessToken);

    return ResponseEntity.SUCCESS();
  }
}
