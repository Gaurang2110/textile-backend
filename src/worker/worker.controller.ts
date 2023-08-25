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
import { WorkerDierctImageDTO, WorkerImageDTO } from './dto/worker-image.dto';
import { WorkerService } from './worker.service';

// 010720200001
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

  @Get('id')
  async getWorkerInintialId() {
    const resp = await this.workerService.getWorkerInintialId();
    return { message: 'New Worker id gets Successfully.', data: resp };
  }

  @Post('upload')
  async uploadWorkerImages(@Body() imageDto: WorkerImageDTO) {
    const resp = await this.workerService.uploadImages(imageDto);
    return { message: 'Action completed Successfully.', data: resp };
  }
}
