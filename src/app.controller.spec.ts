import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController - health check', () => {
  let appController: AppController;
  let appService: { getHealthCheck: jest.Mock };

  beforeEach(async () => {
    appService = { getHealthCheck: jest.fn() };

    const module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: 'IAppService', useValue: appService }],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should return health check success message', async () => {
    const mockResponse = Promise.resolve({
      message: 'success',
      data: { status: 'Database OK!' },
    });

    appService.getHealthCheck.mockReturnValue(mockResponse);

    const result = await appController.getHello();

    expect(result).toEqual(await mockResponse);
    expect(appService.getHealthCheck).toHaveBeenCalled();
  });

  it('should log error and return undefined if appService.getHealthCheck throws', () => {
    const error = new Error('DB down');
    appService.getHealthCheck.mockImplementation(() => {
      throw error;
    });

    const loggerErrorSpy = jest
      .spyOn(appController['logger'], 'error')
      .mockImplementation(() => {});

    const result = appController.getHello();

    expect(result).toBeUndefined();
    expect(loggerErrorSpy).toHaveBeenCalledWith('health check failed', error);

    loggerErrorSpy.mockRestore();
  });
});
