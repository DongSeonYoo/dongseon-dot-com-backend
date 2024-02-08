import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PresignedUrlService {
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

  async getPresignedUrl(fileName: string, contentType: string) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 1);
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: fileName,
      ContentType: contentType,
      Expires: date,
    });

    return getSignedUrl(this.s3, command);
  }
}
