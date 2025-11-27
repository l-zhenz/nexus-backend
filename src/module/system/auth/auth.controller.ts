import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('认证模块')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码获取失败',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '验证码获取成功',
    type: String,
  })
  @Get('captcha')
  getCaptcha() {
    return this.authService.generateCaptcha();
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户名不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户登录成功/失败',
    type: String,
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
