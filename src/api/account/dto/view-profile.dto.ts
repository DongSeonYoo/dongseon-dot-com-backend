import { ApiProperty } from '@nestjs/swagger';

export class ViewUserProfileResponseDto {
  @ApiProperty()
  loginId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  profileImg: string | null;
}
