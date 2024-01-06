/* The AppController class is responsible for handling HTTP requests and streaming video files. */
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/video')
  getVideo(
    @Query('videoName') videoName: string,
    @Req() req: Request,
    @Res() res: Response,
  ): any {
    console.log('videoName', videoName);
    const videoPath = path.join(process.cwd(), 'assets', `${videoName}.mp4`);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers['range'];

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const CHUNK_SIZE = end - start + 1;
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': CHUNK_SIZE,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, headers);
      const videoStream = fs.createReadStream(videoPath, { start, end });
      videoStream.pipe(res);
    } else {
      const headers = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(200, headers);
      fs.createReadStream(videoPath).pipe(res);
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
