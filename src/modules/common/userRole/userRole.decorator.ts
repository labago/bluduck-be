import { SetMetadata } from '@nestjs/common';

export const UserRole = (...userRole: string[]) => SetMetadata('userRole', userRole);