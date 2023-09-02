import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { WorkerImageDTO } from './dto/worker-image.dto';
import { WorkerService } from './worker.service';

// 010720200001
@Controller({
  path: 'worker',
  version: '1',
})
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post()
  async createWorker(@Body() worker: CreateWorkerDto) {
    const resp = await this.workerService.createWorker(worker);
    return { message: 'Worker Created Successfully.', data: resp };
  }

  @Post('update')
  async updateWorker(@Body() worker: CreateWorkerDto) {
    const resp = await this.workerService.createWorker(worker, true);
    return { message: 'Worker updated Successfully.', data: resp };
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

  @Post('pdf')
  async getWorkerPDF() {
    const resp = await this.workerService.createWorkerPDF();
    return { message: 'Action completed Successfully.', data: resp };
  }
}
