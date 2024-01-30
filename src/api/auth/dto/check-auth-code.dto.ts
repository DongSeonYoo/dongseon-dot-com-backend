import { IsEmail, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class CheckAuthCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;
}
