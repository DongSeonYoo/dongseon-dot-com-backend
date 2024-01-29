import { IsNotEmpty, Matches } from 'class-validator';
import { ACCOUNT_REGEX } from '../constant/account.regex';

export class SendVerifyCodeDto {
  @IsNotEmpty()
  @Matches(ACCOUNT_REGEX.EMAIL)
  email: string;
}
