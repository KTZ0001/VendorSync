import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RfqsService } from './rfqs.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('RFQs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rfqs')
export class RfqsController {
  constructor(private readonly rfqsService: RfqsService) {}

  @Post()
  @Roles('PROCUREMENT_OFFICER', 'ADMIN')
  @ApiOperation({ summary: 'Create a new RFQ' })
  create(@Body() body: any, @Request() req: any) {
    return this.rfqsService.create(body, req.user.userId);
  }

  @Get()
  @Roles('PROCUREMENT_OFFICER', 'MANAGER', 'ADMIN', 'VENDOR')
  @ApiOperation({ summary: 'List all RFQs' })
  findAll() {
    return this.rfqsService.findAll();
  }

  @Get(':id')
  @Roles('PROCUREMENT_OFFICER', 'MANAGER', 'ADMIN', 'VENDOR')
  @ApiOperation({ summary: 'Get RFQ details including quotations' })
  findOne(@Param('id') id: string) {
    return this.rfqsService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('MANAGER', 'ADMIN')
  @ApiOperation({ summary: 'Update RFQ status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.rfqsService.updateStatus(id, status);
  }
}
