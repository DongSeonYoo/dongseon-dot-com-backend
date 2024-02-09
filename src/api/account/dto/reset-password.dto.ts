import { IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @IsNumber()
  userIdx: number;

  @IsNotEmpty()
  //   @Matches(/^.{10,20}$/, {
  //   message: '비밀번호 형식이 올바르지 않습니다',
  // })
  newPassword: string;
}
