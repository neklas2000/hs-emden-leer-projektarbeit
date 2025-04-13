import { Test, TestingModule } from '@nestjs/testing';
import { FileadminController } from './fileadmin.controller';

describe('FileadminController', () => {
  let controller: FileadminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileadminController],
    }).compile();

    controller = module.get<FileadminController>(FileadminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
