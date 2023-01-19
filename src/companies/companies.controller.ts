import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/user.decorators';
import { jwtPayload } from '../auth/jwt.payload';
import { JwtAuthGuard } from '../auth/jwt.guard';
import {
  CompanyNameDto,
  promoteCompanyDto,
  UserIndexDto,
} from './dto/companies.dto';
import { CompaniesService } from './companies.service';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('use/:companyName')
  @ApiOperation({ summary: '사용 중인 회사 아이디 검색' })
  async findCompanyName(@Param() param: CompanyNameDto) {
    await this.companiesService.findCompanyName(param);
  }

  @Post('join')
  @ApiOperation({ summary: '회사 지원' })
  async joinCompany(
    @CurrentUser() user: jwtPayload,
    @Body() body: CompanyNameDto,
  ) {
    await this.companiesService.joinCompany(user, body);
  }

  @Get('list')
  @ApiOperation({ summary: '전체 회사 목록 확인' })
  async findCompanyList() {
    return await this.companiesService.findCompanyList();
  }

  @Get('staff/list')
  @ApiOperation({ summary: '소속 회사 인원 확인' })
  async findCompanyStaffList(@CurrentUser() user: jwtPayload) {
    return await this.companiesService.findCompanyStaffList(user);
  }

  @Delete('leave')
  @ApiOperation({
    summary: '회사 탈퇴 or 가입 취소',
    description: '사장은 탈퇴 불가',
  })
  async leaveCompany(@CurrentUser() user: jwtPayload) {
    await this.companiesService.leaveCompany(user);
  }

  @Post('')
  @ApiOperation({
    summary: '회사 생성',
    description: '회사 생성 비용 gold : 1000',
  })
  async createCompany(
    @CurrentUser() user: jwtPayload,
    @Body() body: CompanyNameDto,
  ) {
    await this.companiesService.createCompany(user, body);
  }

  @Get('apply-list')
  @ApiOperation({
    summary: '회사 지원 목록 확인',
    description: '사장 등급만 사용 가능',
  })
  async staffApplyList(@CurrentUser() user: jwtPayload) {
    return await this.companiesService.staffApplyList(user);
  }

  @Delete('')
  @ApiOperation({ summary: '회사 제거', description: '사장 등급만 사용 가능' })
  async deleteCompany(@CurrentUser() user: jwtPayload) {
    await this.companiesService.deleteCompany(user);
  }

  @Patch('promote')
  @ApiOperation({
    summary: '직위 변경, 회사 가입 승인',
    description:
      '가입 승인 시 5, 사장 등급만 사용 가능, 사장으로 변경 시 직위 교체',
  })
  async promoteCompany(
    @CurrentUser() user: jwtPayload,
    @Body() body: promoteCompanyDto,
  ) {
    await this.companiesService.promoteCompany(user, body);
  }

  @Delete('staff/:userIndex')
  @ApiOperation({
    summary: '회사원 제거',
    description: '사장 등급만 사용 가능',
  })
  async deleteCompanyStaff(
    @CurrentUser() user: jwtPayload,
    @Param() param: UserIndexDto,
  ) {
    await this.companiesService.deleteCompanyStaff(user, param);
  }
}
