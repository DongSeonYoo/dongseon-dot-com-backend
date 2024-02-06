import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommonResponseDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    default: 200,
  })
  statusCode: number;

  @IsString()
  @IsJSON()
  @ApiProperty()
  message: string;

  @IsJSON()
  @ApiProperty()
  data: Object;
}
