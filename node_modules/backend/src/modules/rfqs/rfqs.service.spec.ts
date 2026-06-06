import { Test, TestingModule } from '@nestjs/testing';
import { RfqsService } from './rfqs.service';

describe('RfqsService', () => {
  let service: RfqsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RfqsService],
    }).compile();

    service = module.get<RfqsService>(RfqsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
