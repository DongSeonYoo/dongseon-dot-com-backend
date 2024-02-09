import { S3Client } from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import s3Storage from 'multer-s3';
import path from 'path';

const allowedExtensions = ['.png', '.jpg', '.jpeg'];
@Injectable()
export class MulterOptionService implements MulterOptionsFactory {
  private readonly s3: any;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION') as string,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') as string,
        secretAccessKey: this.configService.get(
          'AWS_SECERET_ACCESS_KEY',
        ) as string,
      },
    });
  }

  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    return {
      storage: s3Storage({
        s3: this.s3,
        bucket: this.configService.get('AWS_BUCKET_NAME') as string,
        acl: 'public-read',
        contentType: s3Storage.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          const extension = path.extname(file.originalname);
          if (!allowedExtensions.includes(extension)) {
            return cb(new BadRequestException('확장자를 확인해주세요'));
          }
          this.handleFileKey(req, file, cb);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    };
  }

  private handleFileKey(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: any, key?: string) => void,
  ) {
    if (!req.user?.loginId) {
      throw new UnauthorizedException('로그인 후 사용 가능합니다');
    }
    let fileKey = '';

    if (file.fieldname === 'profileImage') {
      fileKey = `${req.user.loginId}/profile/${new Date().getTime()}.${file.originalname}`;
    }
    if (file.fieldname === 'postImages') {
      fileKey = `${req.user.loginId}/post/${new Date().getTime()}.${file.originalname}`;
    }

    if (!fileKey) {
      throw new BadRequestException('필드 이름을 확인해주세요');
    }

    cb(null, fileKey);
  }
}
