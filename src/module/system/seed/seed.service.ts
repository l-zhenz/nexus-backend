import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { md5 } from '@/utils/crypto';

@Injectable()
export class SeedService implements OnModuleInit {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    // Check if admin user already exists
    const existingAdmin = await this.userRepository.findOneBy({
      username: 'admin',
    });

    if (!existingAdmin) {
      // Create admin user with hashed password
      const adminUser = this.userRepository.create({
        username: 'admin',
        password: md5('123456'),
        email: 'admin@example.com',
        phone: '13800138000',
        avatar: '',
      });

      await this.userRepository.save(adminUser);
    }
  }
}
