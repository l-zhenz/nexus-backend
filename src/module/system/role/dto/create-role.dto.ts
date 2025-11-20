import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  role_name: string;

  @IsString()
  @IsNotEmpty()
  role_code: string;

  @IsString()
  @IsNotEmpty()
  role_description: string;
}
