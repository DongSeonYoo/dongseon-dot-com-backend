import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/common/types/Jwt-payload.types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(jwtOption: IJwtPayload): Promise<string> {
    return this.jwtService.sign(jwtOption);
  }
}
