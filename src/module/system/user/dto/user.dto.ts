import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '手机号' })
  @IsNotEmpty({ message: '手机号不能为空' })
  phone: string;

  @ApiProperty({ description: '头像' })
  avatar?: string;
}
