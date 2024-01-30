import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class SendAuthEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
