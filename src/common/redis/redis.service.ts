import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getTest(key: string) {
    const result = await this.cacheManager.get(key);
    return result;
  }

  async setTest(key: string, value: string) {
    await this.cacheManager.set(key, value, 36000);
  }
}
