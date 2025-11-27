import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { IsOptionalEmail, IsOptionalPhoneNumber } from '@/utils/validators';

export class UserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptionalEmail({ message: '邮箱格式不正确' })
  email?: string;

  @ApiProperty({ description: '手机号', required: false })
  @IsOptionalPhoneNumber({ message: '手机号格式不正确' })
  phone?: string;

  @ApiProperty({ description: '头像', required: false })
  @IsOptional()
  avatar?: string;
}
