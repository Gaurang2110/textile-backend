import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { WorkerImageDTO } from './dto/worker-image.dto';

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
  async uploadWorkerImages(@Body() imageDto: WorkerImageDTO) {
    const resp = await this.workerService.uploadImages(imageDto);
    return { message: 'Action completed Successfully.', data: resp };
  }
}
