import {
  Controller,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('communities')
@ApiTags('communities')
export class CommunitiesController {}
