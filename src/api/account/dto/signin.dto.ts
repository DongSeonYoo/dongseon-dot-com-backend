import { IsJSON, IsNotEmpty } from 'class-validator';

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
