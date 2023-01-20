import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { Users } from 'src/model/users.model';
import { Stages } from '../../model/stages.model';

export class GameInfoDTO extends PickType(Stages, ['stage'] as const) {}

export class GameStageDTO extends PickType(Stages, [
  'coal',
  'bronze',
  'silver',
  'emerald',
  'amethyst',
  'diamond',
  'lithium',
  'useDynamite',
] as const) {}

export class UpdateGameStageDTO extends GameStageDTO {
  @ApiProperty({ description: 'stage', example: 3, required: true })
  @IsNotEmpty()
  @IsNumber()
  stage: number;
}

export class UserSelectDTO extends PickType(Users, ['id'] as const) {}

export class UserStatusSettingDTO extends UserSelectDTO {
  @ApiProperty({ description: 'status', example: true, required: true })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
