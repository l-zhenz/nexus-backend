import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { md5 } from '@/utils/crypto';
import { RedisService } from '@/module/redis/redis.service';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(RedisService)
  private readonly redisService: RedisService;

  async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
      noise: 2,
      color: true,
      background: '#cc9966',
    });
    const captchaId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    await this.redisService.set(
      `captcha:${captchaId}`,
      captcha.text.toLowerCase(),
      parseInt(process.env.CAPTCHA_EXPIRES_IN || '300'),
    );
    return {
      captchaId,
      captcha: captcha.data,
    };
  }
  //校验验证码
  async validateCaptcha(captchaId: string, captcha: string): Promise<boolean> {
    const storedCaptcha = await this.redisService.get(`captcha:${captchaId}`);
    if (!storedCaptcha) {
      return false;
    }
    const isCaptchaValid = storedCaptcha === captcha.toLowerCase();
    if (isCaptchaValid) {
      await this.redisService.delete(`captcha:${captchaId}`);
    }
    return isCaptchaValid;
  }

  async login(loginDto: LoginDto) {
    const { captchaId, captcha, password, username } = loginDto;
    const isCaptchaValid = await this.validateCaptcha(captchaId, captcha);
    if (!isCaptchaValid) {
      throw new HttpException('验证码错误或已过期', HttpStatus.BAD_REQUEST);
    }
    const findUser = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (!findUser) {
      throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST);
    }
    if (findUser.password !== md5(password)) {
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
