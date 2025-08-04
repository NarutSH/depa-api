import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Response } from 'express';

@ApiTags('Ping')
@Controller('ping')
export class PingController {
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Ping server to check if API is running',
    operationId: 'pingServer',
  })
  @ApiResponse({
    status: 200,
    description: 'Server is running - returns HTML status page',
    content: {
      'text/html': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  ping(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
      <html>
        <head>
          <title>DEPA API Ping</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; color: #222; margin: 0; padding: 0; }
            .container { max-width: 480px; margin: 80px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 16px #0001; padding: 32px 24px; text-align: center; }
            h1 { color: #2a7de1; margin-bottom: 0.5em; }
            .version { color: #888; font-size: 1.1em; margin-bottom: 1.5em; }
            .status { display: inline-block; background: #e6f7e6; color: #1a7f1a; border-radius: 6px; padding: 0.4em 1.2em; font-weight: 600; margin-bottom: 1.5em; }
            .footer { color: #aaa; font-size: 0.95em; margin-top: 2em; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>DEPA API</h1>
            <div class="version">Release Version 1.0.0</div>
            <div class="status">✅ Server is running</div>
            <div class="footer">Ping successful — <span id="date"></span></div>
          </div>
          <script>document.getElementById('date').textContent = new Date().toLocaleString();</script>
        </body>
      </html>
    `);
  }
}
