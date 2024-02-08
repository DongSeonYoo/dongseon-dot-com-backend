import { Body, Controller, Post } from '@nestjs/common';
import { PresignedUrlService } from './presigned-url.service';
import { ResponseEntity } from 'src/common/common-response';

@Controller('presigned-url')
export class PresignedUrlController {
  constructor(private readonly presignedUrlService: PresignedUrlService) {}

  @Post('/')
  async presign(
    @Body('filename') filename: string,
    @Body('type') type: string,
  ) {
    const presignedUrl = await this.presignedUrlService.getPresignedUrl(
      filename,
      type,
    );

    return ResponseEntity.SUCCESS_WITH(presignedUrl);
  }
}
