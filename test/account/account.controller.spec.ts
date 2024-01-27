import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from '../../src/api/account/account.controller';
import { AccountService } from '../../src/api/account/account.service';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
