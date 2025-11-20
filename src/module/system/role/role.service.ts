import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;
  constructor() {}
  async create(createRoleDto: CreateRoleDto) {
    const findRole = await this.roleRepository.findOne({
      where: {
        role_code: createRoleDto.role_code,
      },
    });
    if (findRole) {
      throw new HttpException('角色代码已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.roleRepository.save(createRoleDto);
      return { message: '角色创建成功' };
    } catch {
      throw new HttpException('创建角色失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const findRole = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    if (!findRole) {
      throw new HttpException('角色不存在', HttpStatus.NOT_FOUND);
    }
    try {
      // 更新角色信息，确保不修改role_code字段
      const result = await this.roleRepository.update(id, updateRoleDto);
      if (result.affected === 0) {
        throw new HttpException(
          '更新角色失败',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { message: '角色更新成功' };
    } catch (error) {
      // 记录错误信息以便调试
      console.error('更新角色错误:', error);
      throw new HttpException('更新角色失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
