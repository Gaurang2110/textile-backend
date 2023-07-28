import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { WorkerImageDTO } from './dto/worker-image.dto';
import { WorkerService } from './worker.service';

@Controller({
  path: 'worker',
  version: '1',
})
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post()
  async createPost(@Body() worker: CreateWorkerDto) {
    const resp = await this.workerService.createWorker(worker);
    return { message: 'Worker Created Successfully.', data: resp };
  }

  @Get()
  async getAllWorkers() {
    const resp = await this.workerService.getAllWorkers();
    return { message: 'Workers Fetch Successfully.', data: resp };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file, @Body() imageDto: WorkerImageDTO) {
    const resp = await this.workerService.uploadWorkerImage(file, imageDto);
    return { message: 'Action completed Successfully.', data: resp };
  }
}
