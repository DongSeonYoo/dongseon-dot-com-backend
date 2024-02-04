import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseEntity } from 'src/common/dto/common-response.dto';
import { SendAuthEmailDto } from './dto/send-auth-email.dto';
import { CheckAuthCodeDto } from './dto/check-auth-code.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-auth-email')
  async sendAuthEmail(@Body() body: SendAuthEmailDto) {
    await this.authService.sendVerifyCode(body);

    return ResponseEntity.SUCCESS('인증번호 전송 완뇨');
  }

  @HttpCode(200)
  @Post('/check-auth-email')
  async checkAuthCode(@Body() body: CheckAuthCodeDto) {
    await this.authService.checkVerifyCode(body);

    return ResponseEntity.SUCCESS('인증이 완료되었습니다');
  }
}
