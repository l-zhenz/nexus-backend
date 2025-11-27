import { ApiProperty } from '@nestjs/swagger';

export class UserVo {
  @ApiProperty({ description: '用户ID' })
  id: string;
  @ApiProperty({ description: '用户名' })
  username: string;
  @ApiProperty({ description: '邮箱' })
  email?: string;
  @ApiProperty({ description: '手机号' })
  phone?: string;
  @ApiProperty({ description: '头像' })
  avatar?: string;
  // @ApiProperty({ description: '角色', type: 'array' })
  // roles: string[];
}
