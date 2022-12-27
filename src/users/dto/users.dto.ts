import { PickType } from '@nestjs/swagger';
import { Users } from '../../model/users.model';

export class UserIdDto extends PickType(Users, ['id'] as const) {}

export class UserMainDto extends PickType(Users, ['id', 'password'] as const) {}

export class NickNameDto extends PickType(Users, ['nickname'] as const) {}
