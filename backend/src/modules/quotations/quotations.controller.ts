import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Quotations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all quotations for current procurement cycle' })
  findAll() {
    return this.quotationsService.findAll();
  }

  @Get('compare/:rfqId')
  @ApiOperation({ summary: 'Compare quotations for an RFQ' })
  compare(@Param('rfqId') rfqId: string) {
    return this.quotationsService.compareByRfq(rfqId);
  }

  @Post(':id/select')
  @ApiOperation({ summary: 'Select a quotation' })
  select(@Param('id') id: string, @Req() req: any) {
    return this.quotationsService.selectQuotation(id, req.user.userId);
  }
}
