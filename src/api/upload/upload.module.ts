import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { MulterOptionService } from './multer-config.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterOptionService,
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
