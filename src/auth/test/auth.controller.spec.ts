import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let body: any = {
    email: 'test@example.com',
    password: 'password',
    name: 'test'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('done! sign-up', () => {
  //   expect(controller.signUp(body)).toEqual('Hello World!');
  // });


});
