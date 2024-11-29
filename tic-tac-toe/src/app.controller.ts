import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorator/auth.decorator';

@Controller('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/')
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
}
