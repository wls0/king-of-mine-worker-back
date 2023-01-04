import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CompanyNameDto,
  CompanyCreateDto,
  CompanyPromoteDto,
  UserIndexDto,
} from './dto/companies.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor() {}

  @Get(':companyName')
  @ApiOperation({ summary: '사용 중인 회사 아이디 검색' })
  async findCompanyName(@Param() param: CompanyNameDto) {}

  @Post('join')
  @ApiOperation({ summary: '회사 지원' })
  async joinCompany(@Body() body: CompanyNameDto) {}

  @Get('list')
  @ApiOperation({ summary: '전체 회사 목록 확인' })
  async companyList() {}

  @Get('staff/list')
  @ApiOperation({ summary: '소속 회사 인원 확인' })
  async companyStaffList() {}

  @Delete('leave')
  @ApiOperation({
    summary: '회사 탈퇴',
    description: '사장은 탈퇴 불가',
  })
  async companyleave() {}

  @Post('')
  @ApiOperation({ summary: '회사 생성', description: '사장 등급만 사용 가능' })
  async createCompany(@Body() body: CompanyCreateDto) {}

  @Get('apply-list')
  @ApiOperation({
    summary: '회사 지원 목록 확인',
    description: '사장 등급만 사용 가능',
  })
  async staffApplyList() {}

  @Delete('')
  @ApiOperation({ summary: '회사 제거', description: '사장 등급만 사용 가능' })
  async deleteCompany() {}

  @Patch('promote')
  @ApiOperation({
    summary: '직위 변경',
    description: '사장 등급만 사용 가능, 사장으로 변경 시 직위 교체',
  })
  async companyPromote(@Body() body: CompanyPromoteDto) {}

  @Delete('staff/:userIndex')
  @ApiOperation({
    summary: '회사원 제거',
    description: '사장 등급만 사용 가능',
  })
  async deleteCompanyStaff(@Param() param: UserIndexDto) {}
}
