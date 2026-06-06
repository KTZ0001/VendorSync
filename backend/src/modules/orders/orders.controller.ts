import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Purchase Orders & Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('po/:quotationId')
  @ApiOperation({ summary: 'Convert an approved quotation into a Purchase Order' })
  createPO(@Param('quotationId') quotationId: string, @Req() req: any) {
    return this.ordersService.createPO(quotationId, req.user.userId);
  }

  @Post('invoice/:poId')
  @ApiOperation({ summary: 'Generate an invoice from a Purchase Order' })
  createInvoice(@Param('poId') poId: string, @Req() req: any) {
    return this.ordersService.createInvoice(poId, req.user.userId);
  }

  @Get('po')
  @ApiOperation({ summary: 'List all Purchase Orders' })
  findAllPOs() {
    return this.ordersService.findAllPOs();
  }

  @Get('po/:id')
  @ApiOperation({ summary: 'Get detailed PO with tax info and items' })
  findOnePO(@Param('id') id: string) {
    return this.ordersService.getPO(id);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List all Invoices' })
  findAllInvoices() {
    return this.ordersService.findAllInvoices();
  }
}
