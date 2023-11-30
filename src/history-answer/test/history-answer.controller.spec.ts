import { Test, TestingModule } from '@nestjs/testing';
import { HistoryAnswerController } from '../history-answer.controller';

describe('HistoryAnswerController', () => {
  let controller: HistoryAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryAnswerController],
    }).compile();

    controller = module.get<HistoryAnswerController>(HistoryAnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
