import { Module } from '@nestjs/common';
import { RfqsService } from './rfqs.service';
import { RfqsController } from './rfqs.controller';

@Module({
  providers: [RfqsService],
  controllers: [RfqsController]
})
export class RfqsModule {}
