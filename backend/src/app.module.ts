import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service'; // Added explicit import
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { RfqsModule } from './modules/rfqs/rfqs.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ActivityModule } from './modules/activity/activity.module';
import { RolesGuard } from './modules/auth/roles.guard';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    VendorsModule, 
    RfqsModule, 
    QuotationsModule, 
    OrdersModule, 
    ActivityModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
  ], // Added PrismaService here - Critical for startup
})
export class AppModule {}
