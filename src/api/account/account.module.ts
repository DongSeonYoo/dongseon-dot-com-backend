import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAccessTokenStrategy } from '../auth/strategy/jwt-access.strategy';

@Module({
  imports: [AuthModule],
  controllers: [AccountController],
  providers: [AccountService, PrismaService, JwtAccessTokenStrategy],
})
export class AccountModule {}
