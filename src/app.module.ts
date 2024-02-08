import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './api/account/account.module';
import { AuthModule } from './api/auth/auth.module';
import { PostModule } from './api/post/post.module';
import { UploadModule } from './api/upload/upload.module';
import { PresignedUrlModule } from './api/presigned-url/presigned-url.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountModule,
    AuthModule,
    PostModule,
    UploadModule,
    PresignedUrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
