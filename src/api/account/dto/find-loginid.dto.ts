import { IsNotEmpty, Matches } from 'class-validator';
import { ACCOUNT_REGEX } from '../constant/account.regex';

export class FindLoginIdDto {
  @IsNotEmpty()
  @Matches(ACCOUNT_REGEX.NAME)
  name: string;

  @IsNotEmpty()
  @Matches(ACCOUNT_REGEX.PHONE_NUMBER)
  phoneNumber: string;

  @IsNotEmpty()
  @Matches(ACCOUNT_REGEX.EMAIL)
  email: string;
}

export class FindLoginIdResponseDto {
  loginId: string;
}
