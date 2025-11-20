import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { md5 } from 'src/utils/crypto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserVo } from './vo/user.vo';
import { omit } from 'lodash';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  async create(userDto: UserDto): Promise<UserVo> {
    const findUser = await this.userRepository.findOneBy({
      username: userDto.username,
    });
    if (findUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const findEmail = await this.userRepository.findOneBy({
      email: userDto.email,
    });
    if (findEmail) {
      throw new HttpException('邮箱已注册', HttpStatus.BAD_REQUEST);
    }

    const findPhone = await this.userRepository.findOneBy({
      phone: userDto.phone,
    });
    if (findPhone) {
      throw new HttpException('手机号已注册', HttpStatus.BAD_REQUEST);
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
      return omit(savedUser, ['password']) as UserVo;
    } catch {
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
      },
    });
    if (!findUser) {
      throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST);
    }
    if (findUser.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    const token = this.jwtService.sign(
      {
        username: findUser.username,
        id: findUser.id,
      },
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      } as JwtSignOptions,
    );

    const refreshToken = this.jwtService.sign(
      {
        id: findUser.id,
      },
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      } as JwtSignOptions,
    );
    return {
      token,
      refreshToken,
    };
  }
}
