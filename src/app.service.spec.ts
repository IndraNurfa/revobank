import { AppService } from './app.service';

describe('AppService - getHealthCheck', () => {
  let appService: AppService;
  let prismaService: { $queryRaw: jest.Mock };

  beforeEach(() => {
    prismaService = { $queryRaw: jest.fn() };
    appService = new AppService(prismaService as any);
  });

  it('should return "Database OK!" if query returns truthy', async () => {
    prismaService.$queryRaw.mockResolvedValue([1]); // simulate successful query

    const result = await appService.getHealthCheck();

    expect(result).toBe('Database OK!');
    expect(prismaService.$queryRaw).toHaveBeenCalledWith(expect.anything());
  });

  it('should return "Database Down!" if query returns falsy', async () => {
    prismaService.$queryRaw.mockResolvedValue(null); // simulate no result

    const result = await appService.getHealthCheck();

    expect(result).toBe('Database Down!');
    expect(prismaService.$queryRaw).toHaveBeenCalledWith(expect.anything());
  });
});
