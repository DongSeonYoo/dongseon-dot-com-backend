import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SignupRequestDto {
  @ApiProperty()
  @Matches(/^[A-Za-z0-9]{5,20}$/, {
    message: '아이디 형식이 올바르지 않습니다',
  })
  @IsNotEmpty({
    message: '아이디가 입력되지 않았습니다',
  })
  loginId: string;

  // @Matches(/^.{10,20}$/, {
  //   message: '비밀번호 형식이 올바르지 않습니다',
  // })
  @ApiProperty()
  @IsNotEmpty({
    message: '비밀번호가 입력되지 않았습니다',
  })
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({
    message: '이메일이 입력되지 않았습니다',
  })
  email: string;

  @ApiProperty()
  @Matches(/^[가-힣a-zA-Z]{2,8}$/, {
    message: '이름이 올바르지 않습니다',
  })
  @IsNotEmpty({
    message: '이름이 입력되지 않았습니다',
  })
  name: string;

  @ApiProperty()
  @Matches(/^0\d{10}$/, {
    message: '전화번호가 올바르지 않습니다',
  })
  @IsNotEmpty({
    message: '전화번호가 입력되지 않았습니다',
  })
  phoneNumber: string;

  //   @Matches(/^0\d{10}$/)
  @ApiProperty()
  @IsNotEmpty({
    message: '프로필 사진이 입력되지 않았습니다',
  })
  profileImg: string;

  //   @Matches(/^0\d{10}$/)
  @ApiProperty()
  @IsOptional()
  provider?: string | null;
}

export class SignupResponseDto {
  @ApiProperty()
  @IsJSON()
  userIdx: number;
}
