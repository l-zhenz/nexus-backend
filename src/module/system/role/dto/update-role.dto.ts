import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  role_name: string;

  @IsString()
  @IsNotEmpty()
  role_description: string;
}
