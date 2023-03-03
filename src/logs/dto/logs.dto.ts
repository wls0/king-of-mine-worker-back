import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class FindLogDto {
  @ApiProperty({
    example: 'stage',
    description: 'type',
    required: true,
  })
  @IsIn(['account', 'stage', 'item', 'company'])
  @IsNotEmpty()
  type: 'account' | 'stage' | 'item' | 'company';

  @ApiProperty({
    example: '2022-01-01',
    description: 'startDate',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  startDate: string;

  @ApiProperty({
    example: '2022-01-10',
    description: 'endDate',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  endDate: string;
}

export class SaveLogDto {
  @IsIn(['account', 'stage', 'item', 'company'])
  @IsNotEmpty()
  type: 'account' | 'stage' | 'item' | 'company';

  log: any;
}
