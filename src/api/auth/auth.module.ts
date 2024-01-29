import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/common/mail/mail.module';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  imports: [
    RedisModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRED_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    MailModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
