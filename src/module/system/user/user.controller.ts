import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: UserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户名已存在/邮箱已存在/手机号已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户注册成功/失败',
    type: String,
  })
  @Post()
  create(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }

  @ApiBody({ type: LoginUserDto })
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
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
}
