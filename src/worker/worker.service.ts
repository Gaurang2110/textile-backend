import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { Worker, WorkerDocument } from './schema/worker.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UtilityFunctions } from 'src/utils/functions';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Worker.name)
    private readonly WorkerModel: Model<WorkerDocument>,
    private readonly utilityFunctions: UtilityFunctions,
  ) {}
  async createWorker(worker: CreateWorkerDto) {
    try {
      const defaultPassword = 'Textile@1234';
      const cryptPass = await this.utilityFunctions.cryptPassword(
        defaultPassword,
      );
      if (cryptPass?.error) {
        throw new HttpException(
          cryptPass?.error?.message || 'Something went wrong.',
          cryptPass?.error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const workerObj = await this.WorkerModel.create({
        ...worker,
        password: cryptPass.hashPassword,
      });
      await workerObj.save();
      const workerResp = (await this.WorkerModel.findById(workerObj._id)).toJSON();
      return workerResp;
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllWorkers() {
    try {
      return this.WorkerModel.find({});
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
