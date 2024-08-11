import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

export const ROlES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROlES_KEY, roles);
