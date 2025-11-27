import { Controller, Post, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RequireLogin } from '@/utils/metadata';

@ApiTags('用户管理模块')
@Controller('user')
@UseGuards(AuthGuard)
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
  @Post('create')
  @RequireLogin()
  create(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }

  @Post('delete')
  @RequireLogin()
  delete(@Body('id') id: string) {
    return this.userService.delete(id);
  }
}
