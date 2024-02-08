import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { ResponseEntity } from 'src/common/common-response';
import { ApiTags } from '@nestjs/swagger';
import s3Storage from 'multer-s3';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor() {}

  @Post('profile-image')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async uploadProfileImg(@UploadedFile() file: Express.MulterS3.File | null) {
    if (!file) {
      throw new BadRequestException('파일이 존재하지 않습니다');
    }

    return ResponseEntity.SUCCESS_WITH({
      location: file.location,
    });
  }

  @Post('post-images')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(
    FilesInterceptor('postImages', 10, {
      limits: {
        files: 10,
      },
    }),
  )
  async uploadPostImages(
    @UploadedFiles() files: Express.MulterS3.File[] | null,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('파일이 존재하지 않습니다');
    }
    const location = files.map((file) => file.location);

    return ResponseEntity.SUCCESS_WITH({
      location,
    });
  }
}
