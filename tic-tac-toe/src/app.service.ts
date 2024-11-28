import { Injectable } from '@nestjs/common';
import { Public } from './auth/decorator/auth.decorator';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
