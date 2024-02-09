import { ApiProperty } from '@nestjs/swagger';

export class ViewDetailProfileResponseDto {
  @ApiProperty()
  loginId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phoneNumber: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  profileImg: string | null;
}
