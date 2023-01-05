import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Companies } from '../../model/companies.model';
import { CompanyUsers } from '../../model/company-users.model';

export class CompanyNameDto extends PickType(Companies, [
  'companyName',
] as const) {}
export class CompanyCreateDto extends CompanyNameDto {
  @ApiProperty({
    example: 1000,
    description: 'gold',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  gold: number;
}

export class UserIndexDto {
  @ApiProperty({
    example: 'shjfsldflkji312093uiojfslaaksd;r23rj',
    description: 'userIndex',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userIndex: string;
}

export class promoteCompanyDto extends PickType(CompanyUsers, [
  'position',
] as const) {
  @ApiProperty({
    example: 'shjfsldflkjjuserIndex',
    description: 'staffIndex',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  staffIndex: string;
}
