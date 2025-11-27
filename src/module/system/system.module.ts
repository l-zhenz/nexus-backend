import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [UserModule, RoleModule, AuthModule, SeedModule],
  exports: [UserModule, RoleModule],
})
export class SystemModule {}
