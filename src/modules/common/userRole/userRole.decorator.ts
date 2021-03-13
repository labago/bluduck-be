import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'modules/user';

export const UserRole = (...userRole: UserRoleEnum[]) => SetMetadata('userRole', userRole);