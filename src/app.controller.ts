import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiOperation({ summary: 'A test Hello world' })
  @ApiOkResponse({
    schema: { example: 'Hello, world!' },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
