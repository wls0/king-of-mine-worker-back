import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Stages } from '../../model/stages.model';
import { SaveLogDto } from '../../logs/dto/logs.dto';

export class StageInfoDto extends PickType(Stages, ['stage'] as const) {}
export class PlayGameDTO extends PickType(Stages, [
  'stage',
  'coal',
  'bronze',
  'silver',
  'emerald',
  'amethyst',
  'diamond',
  'lithium',
] as const) {}

export class UpgradeItemDTO {
  @ApiProperty({
    example: 'drill',
    description: 'category',
    required: true,
  })
  @IsIn(['drill', 'oxygenRespirator', 'dynamite', 'coworker'])
  @IsString()
  @IsNotEmpty()
  category: 'drill' | 'oxygenRespirator' | 'dynamite' | 'coworker';
}

export class UseGoldDTO extends SaveLogDto {
  @ApiProperty({
    example: 600,
    description: 'gold',
    required: true,
  })
  gold: number;
  // 획득 === true, 사용 === false
  @ApiProperty({
    example: true,
    description: 'use',
    required: true,
  })
  use: boolean;
}

export class CompanyRankDTO {
  @ApiProperty({
    example: 10,
    description: 'point',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  point: number;
}
