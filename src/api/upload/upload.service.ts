import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  extractImageLocation(files: Express.MulterS3.File[]): string[] {
    return files.map((file) => file.location);
  }
}
