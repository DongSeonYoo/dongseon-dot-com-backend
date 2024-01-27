import { IsNotEmpty } from 'class-validator';

export class FindLoginIdDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  email: string;
}
