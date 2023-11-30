import { Test, TestingModule } from '@nestjs/testing';
import { HistoryAnswerService } from '../history-answer.service';

describe('HistoryAnswerService', () => {
  let service: HistoryAnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryAnswerService],
    }).compile();

    service = module.get<HistoryAnswerService>(HistoryAnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
