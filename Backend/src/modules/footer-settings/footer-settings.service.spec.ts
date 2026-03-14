import { Test, TestingModule } from '@nestjs/testing';
import { FooterSettingsService } from './footer-settings.service';

describe('FooterSettingsService', () => {
  let service: FooterSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FooterSettingsService],
    }).compile();

    service = module.get<FooterSettingsService>(FooterSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
