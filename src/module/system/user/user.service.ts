import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { md5 } from 'src/utils/crypto';
import { UserVo } from './vo/user.vo';
import { instanceToPlain } from 'class-transformer';
@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async create(userDto: UserDto): Promise<UserVo> {
    const findUser = await this.userRepository.findOneBy({
      username: userDto.username,
    });
    if (findUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    if (userDto.email) {
      const findEmail = await this.userRepository.findOneBy({
        email: userDto.email,
      });
      if (findEmail) {
        throw new HttpException('邮箱已注册', HttpStatus.BAD_REQUEST);
      }
    }
    if (userDto.phone) {
      const findPhone = await this.userRepository.findOneBy({
        phone: userDto.phone,
      });
      if (findPhone) {
        throw new HttpException('手机号已注册', HttpStatus.BAD_REQUEST);
      }
    }
    const newUser = this.userRepository.create({
      username: userDto.username,
      password: md5(userDto.password),
      email: userDto.email,
      phone: userDto.phone,
      avatar: userDto.avatar,
    });
    try {
      const savedUser = await this.userRepository.save(newUser);
      return instanceToPlain(savedUser) as UserVo;
    } catch {
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<void> {
    // Get user by ID to check if it's the admin user
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    // Prevent deletion of admin user
    if (user.username === 'admin') {
      throw new HttpException('管理员用户不可删除', HttpStatus.FORBIDDEN);
    }

    try {
      await this.userRepository.delete(id);
    } catch {
      throw new HttpException('删除用户失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
