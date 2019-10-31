import { Test, TestingModule } from '@nestjs/testing';
import { RegisterEventController } from './register-event.controller';

describe('RegisterEvent Controller', () => {
  let controller: RegisterEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterEventController],
    }).compile();

    controller = module.get<RegisterEventController>(RegisterEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
