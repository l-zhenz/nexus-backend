import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      database: parseInt(process.env.REDIS_DB || '1'),
    });

    this.client.connect().catch((err: Error) => {
      console.error('Redis connection error:', err);
    });
  }

  async set(key: string, value: string, expiresIn: number): Promise<void> {
    await this.client.set(key, value, {
      EX: expiresIn,
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
