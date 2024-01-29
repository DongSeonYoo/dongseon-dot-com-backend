import { OmitType } from '@nestjs/mapped-types';
import { SignupRequestDto } from './signup.dto';
import { IsOptional, Matches } from 'class-validator';
import { ACCOUNT_REGEX } from '../constant/account.regex';

export class ModifyProfileDto extends OmitType(SignupRequestDto, [
  'loginId',
  'password',
  'provider',
] as const) {
  @IsOptional()
  @Matches(ACCOUNT_REGEX.EMAIL)
  email: string;

  @IsOptional()
  @Matches(ACCOUNT_REGEX.NAME)
  name: string;

  @IsOptional()
  @Matches(ACCOUNT_REGEX.PHONE_NUMBER)
  phoneNumber: string;

  @IsOptional()
  // @Matches(ACCOUNT_REGEX.EMAIL)
  profileImg: string;
}
