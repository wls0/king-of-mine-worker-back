import { PickType } from '@nestjs/swagger';
import { Users } from '../../model/users.model';

export class UserIdDto extends PickType(Users, ['id']) {}

export class UserMainDto extends PickType(Users, ['id', 'password']) {}

export class NickNameDto extends PickType(Users, ['nickname']) {}
