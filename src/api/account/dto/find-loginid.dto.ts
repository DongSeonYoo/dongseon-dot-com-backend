import { IsNotEmpty, Matches } from 'class-validator';
import { ACCOUNT_REGEX } from '../constant/account.regex';
import { ApiProperty } from '@nestjs/swagger';

export class FindLoginIdRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(ACCOUNT_REGEX.NAME)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(ACCOUNT_REGEX.PHONE_NUMBER)
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(ACCOUNT_REGEX.EMAIL)
  email: string;
}

export class FindLoginIdResponseDto {
  @ApiProperty({
    description: '찾은 로그인 아이디',
  })
  loginId: string;
}
