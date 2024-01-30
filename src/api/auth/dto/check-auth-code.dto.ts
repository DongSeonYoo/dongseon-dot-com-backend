import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  Length,
} from 'class-validator';

export class CheckAuthCodeDto {
  @IsEmail({}, { message: '이메일이 올바르지 않습니다' })
  @IsNotEmpty({ message: '이메일이 입력되지 않았습니다' })
  email: string;

  @IsNumber({}, { message: '인증번호가 유효하지 않습니다' })
  @IsNotEmpty({ message: '인증번호가 입력되지 않았습니다' })
  code: number;
}
