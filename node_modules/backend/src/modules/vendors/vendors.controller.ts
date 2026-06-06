import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createVendorDto: any) {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @Roles('PROCUREMENT_OFFICER', 'MANAGER', 'ADMIN')
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  @Roles('PROCUREMENT_OFFICER', 'MANAGER', 'ADMIN', 'VENDOR')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateVendorDto: any) {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }
}
