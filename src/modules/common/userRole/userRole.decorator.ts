import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'modules/user/user.entity';

export const UserRole = (...userRole: UserRoleEnum[]) => SetMetadata('userRole', userRole);