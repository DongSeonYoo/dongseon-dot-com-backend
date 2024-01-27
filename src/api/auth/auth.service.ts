import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuth } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(jwtOption: IAuth.IJwtPayload): Promise<string> {
    return this.jwtService.sign(jwtOption);
  }
}
