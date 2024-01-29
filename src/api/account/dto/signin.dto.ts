import { IsJSON, IsNotEmpty, Matches } from 'class-validator';
import { ACCOUNT_REGEX } from '../constant/account.regex';

export class SigninRequestDto {
  @IsNotEmpty()
  loginId: string;

  @IsNotEmpty()
  password: string;
}

export class SigninResponseDto {
  @IsJSON()
  accessToken: string;
}
