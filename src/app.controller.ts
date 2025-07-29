import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

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
