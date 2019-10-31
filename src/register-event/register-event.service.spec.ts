import { Test, TestingModule } from '@nestjs/testing';
import { RegisterEventService } from './register-event.service';

describe('RegisterEventService', () => {
  let service: RegisterEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterEventService],
    }).compile();

    service = module.get<RegisterEventService>(RegisterEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
