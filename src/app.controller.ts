import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHello(): Promise<string> | undefined {
    try {
      return this.appService.getHealthCheck();
    } catch (error) {
      this.logger.error('health check failed', error);
    }
  }
}
