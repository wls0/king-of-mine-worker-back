import { IsIn } from 'class-validator';
import {
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator/types/decorator/decorators';

export class FindLogDto {
  @IsIn(['account', 'stage', 'item', 'company'])
  @IsNotEmpty()
  type: 'account' | 'stage' | 'item' | 'company';

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  endDate: string;
}

export class SaveLogDto {
  @IsIn(['account', 'stage', 'item', 'company'])
  @IsNotEmpty()
  type: 'account' | 'stage' | 'item' | 'company';
}
