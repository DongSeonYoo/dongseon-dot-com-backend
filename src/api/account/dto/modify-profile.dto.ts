import { OmitType } from '@nestjs/mapped-types';
import { SignupRequestDto } from './signup.dto';
import { IsOptional } from 'class-validator';

export class ModifyProfileDto extends OmitType(SignupRequestDto, [
  'loginId',
  'password',
  'provider',
] as const) {
  @IsOptional()
  email: string;

  @IsOptional()
  name: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  profileImg: string;
}
