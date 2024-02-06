import { IsJSON, IsNotEmpty, Matches } from 'class-validator';
import { ACCOUNT_REGEX } from '../constant/account.regex';
import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';

export class SigninRequestDto {
  @IsNotEmpty()
  @ApiProperty({ description: '로그인 아이디' })
  loginId: string;

  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호' })
  password: string;
}

export class SigninResponseDto extends CommonResponseDto {
  @IsJSON()
  @ApiProperty({ description: '유저의 accessToken' })
  accessToken: string;
}
