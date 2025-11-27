import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  username: string;
  password: string;
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
  @IsNotEmpty({ message: '验证码ID不能为空' })
  captchaId: string;
}
