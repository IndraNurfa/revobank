import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IAppService } from './app.interface';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(
    @Inject('IAppService') private readonly appService: IAppService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Check database connection status' })
  @ApiResponse({
    status: 200,
    description: 'Health check status',
    schema: {
      example: {
        message: 'success',
        data: {
          status: 'Database OK!',
        },
      },
    },
  })
  getHello(): Promise<string> | undefined {
    try {
      return this.appService.getHealthCheck();
    } catch (error) {
      this.logger.error('health check failed', error);
    }
  }
}
