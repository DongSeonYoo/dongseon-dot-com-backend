import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { ConfigService } from '@nestjs/config';
import { ResponseEntity } from 'src/common/common-response';

@Controller('upload')
export class UploadController {
  constructor(configService: ConfigService) {}
  @Post('profile-image')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async uploadProfileImg(@UploadedFile() file: Express.MulterS3.File) {
    return ResponseEntity.SUCCESS_WITH({
      location: file.location,
    });
  }

  @Post('post-images')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FilesInterceptor('postImages', 10))
  async uploadPostImages(@UploadedFiles() files: Express.MulterS3.File[]) {
    const location = files.map(({ location }) => location);

    return ResponseEntity.SUCCESS_WITH({
      location,
    });
  }
}
