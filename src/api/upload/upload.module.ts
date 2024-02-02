import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import s3Storage from 'multer-s3';
import * as multerS3 from 'multer-s3';

// @Module({
//   imports: [],
//   exports: [UploadService],
//   controllers: [UploadController],
//   providers: [
//     UploadService,
//     {
//       provide: 'S3_CLIENT',
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         return new S3Client({
//           region: configService.get('AWS_REGION'),
//           credentials: {
//             accessKeyId: configService.get('AWS_ACCESS_KEY_ID') as string,
//             secretAccessKey: configService.get(
//               'AWS_SECERET_ACCESS_KEY',
//             ) as string,
//           },
//         });
//       },
//     },
//   ],
// })

// @Module({
//   imports: [
//     MulterModule.registerAsync({
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         return {
//           storage: multerS3({
//             s3: new S3Client({
//               region: configService.get('AWS_REGION') as string,
//               credentials: {
//                 accessKeyId: configService.get('AWS_ACCESS_KEY_ID') as string,
//                 secretAccessKey: configService.get(
//                   'AWS_SECERET_ACCESS_KEY',
//                 ) as string,
//               },
//             }),
//             bucket: configService.get('AWS_BUCKET_NAME')!,
//             contentType: multerS3.AUTO_CONTENT_TYPE,
//             key(req, file, callback) {
//               console.log('????');
//               const allowedExtensions = ['.png', '.jpg', '.jpeg'];
//               const ext = extname(file.originalname);

//               if (!allowedExtensions.includes(ext)) {
//                 return callback(
//                   new BadRequestException('확장자를 확인해주세요'),
//                 );
//               }
//               callback(
//                 null,
//                 `${req.user!.loginId}/image/${Date.now()}_${file.originalname}`,
//               );
//             },
//             acl: 'public-read-write',
//           }),
//           limits: {
//             fileSize: 5 * 1024 * 1024,
//           },
//         };
//       },
//     }),
//   ],
//   exports: [UploadService],
//   controllers: [UploadController],
//   providers: [UploadService],
// })
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const s3 = new S3Client({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID') as string,
            secretAccessKey: configService.get(
              'AWS_SECERET_ACCESS_KEY',
            ) as string,
          },
        });

        return {
          storage: s3Storage({
            s3,
            bucket: configService.get('AWS_BUCKET_NAME') as string,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, callback) {
              callback(
                null,
                `${req.user?.loginId}/${new Date().getDate()}_${file.originalname}`,
              );
            },
          }),
          limits: {
            fileSize: 1024 * 1024 * 5,
            files: 10,
          },
          fileFilter(req, file, callback) {
            callback(null, true);
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [UploadService],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
