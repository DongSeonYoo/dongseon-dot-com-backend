import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { ACCOUNT_REGEX } from '../constant/account.regex';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';

export class SignupRequestDto {
  @ApiProperty()
  @Matches(ACCOUNT_REGEX.LOGIN_ID, {
    message: '아이디 형식이 올바르지 않습니다',
  })
  @IsNotEmpty({
    message: '아이디가 입력되지 않았습니다',
  })
  loginId: string;

  @ApiProperty()
  // @Matches(ACCOUNT_REGEX.PASSWORD, {
  //   message: '비밀번호 형식이 올바르지 않습니다',
  // })
  @IsNotEmpty({
    message: '비밀번호가 입력되지 않았습니다',
  })
  password: string;

  @ApiProperty()
  @Matches(ACCOUNT_REGEX.EMAIL, {
    message: '이메일 형식이 올바르지 않습니다',
  })
  @IsNotEmpty({
    message: '이메일이 입력되지 않았습니다',
  })
  email: string;

  @ApiProperty()
  @Matches(ACCOUNT_REGEX.NAME, {
    message: '이름이 올바르지 않습니다',
  })
  @IsNotEmpty({
    message: '이름이 입력되지 않았습니다',
  })
  name: string;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  phoneNumber?: string;

  //   @Matches(/^0\d{10}$/)
  @ApiProperty()
  @IsOptional()
  profileImg: string;

  //   @Matches(/^0\d{10}$/)
  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  provider?: string;
}

export class SignupResponseDto extends CommonResponseDto {
  @IsJSON()
  @ApiProperty()
  userIdx: number;
}
