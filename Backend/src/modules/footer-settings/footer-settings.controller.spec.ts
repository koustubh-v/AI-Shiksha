import { Test, TestingModule } from '@nestjs/testing';
import { FooterSettingsController } from './footer-settings.controller';

describe('FooterSettingsController', () => {
  let controller: FooterSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FooterSettingsController],
    }).compile();

    controller = module.get<FooterSettingsController>(FooterSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
