import { Controller, Get, Param } from '@nestjs/common';
import { Body, Delete, Patch, Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('communities')
@ApiTags('communities')
export class CommunitiesController {}
