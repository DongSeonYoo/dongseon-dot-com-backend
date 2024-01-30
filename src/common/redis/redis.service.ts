import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getAuthCode(email: string) {
    const code = await this.cacheManager.get(email);
    return code;
  }

  async setAuthCode(email: string, code: number) {
    await this.cacheManager.set(email, code, 360000);
  }

  async deleteCode(email: string) {
    await this.cacheManager.del(email);
  }
}
