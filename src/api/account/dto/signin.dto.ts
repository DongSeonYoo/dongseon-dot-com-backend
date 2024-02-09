import { IsJSON, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninRequestDto {
  @IsNotEmpty()
  @ApiProperty({ description: '로그인 아이디' })
  loginId: string;

  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호' })
  password: string;
}

export class SigninResponseDto {
  @IsJSON()
  @ApiProperty({ description: '유저의 accessToken', name: 'accessToken' })
  accessToken: string;
}
