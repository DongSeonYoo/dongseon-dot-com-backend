import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorator/user.decorator';
import { IJwtPayload } from 'src/common/types/Jwt-payload.types';
import { ResponseEntity } from 'src/common/dto/common-response.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/post-img')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FilesInterceptor('postImages', 10))
  async uploadPostImages(
    @UploadedFiles() files: Express.MulterS3.File[],
    @User() user: IJwtPayload,
  ) {
    const locationResult = this.uploadService.extractImageLocation(files);
    return ResponseEntity.SUCCESS_WITH(locationResult);
  }
}
