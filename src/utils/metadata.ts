import { SetMetadata } from '@nestjs/common';

export const RequireLogin = () => SetMetadata('require-login', true);
export const Public = () => SetMetadata('require-login', false);
