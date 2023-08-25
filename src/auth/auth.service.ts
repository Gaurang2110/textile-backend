import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { loginDTO } from './dto/login.dto';
import { UtilityFunctions } from 'src/utils/functions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkerDocument, Worker } from 'src/worker/schema/worker.schema';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

interface IMongoModel {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
interface IRole extends IMongoModel {
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Worker.name)
    private readonly workerModel: Model<WorkerDocument>,
    private readonly utilityFunctions: UtilityFunctions,
    private readonly configService: ConfigService,
  ) {}

  signPayload(payload): string {
    const token = sign(payload, this.configService.get('JWT_SECRET', ''), {
      expiresIn: '1d',
    });
    return token;
  }

  async login(dto: loginDTO) {
    try {
      const worker = await this.workerModel
        .findOne({
          emailAddress: dto.email,
        })
        .select(['emailAddress', 'password', 'name', 'alterNo', 'role'])
        .populate<{ role: Partial<IRole> }>({ path: 'role', select: 'name' });
      if (!worker?._id) {
        throw new BadRequestException('Email address not registered');
      }

      console.log(worker);

      const compare = await this.utilityFunctions.comparePassword(
        dto.password,
        worker.password,
      );

      if (!compare.isMatch || compare.error) {
        throw new BadRequestException(
          compare?.error?.message ?? 'Please provide valid Password.',
        );
      }

      const payload = {
        id: worker._id,
        name: worker.name,
        email: worker.emailAddress,
        alterNo: worker.alterNo,
        role: worker.role?.name ?? '',
      };
      const token = this.signPayload(payload);

      if (dto.latitude && dto.longtitude) {
        await this.workerModel.findByIdAndUpdate(worker._id, {
          $set: {
            latitude: dto.latitude,
            longtitude: dto.longtitude,
          },
        });
      }

      const { password, ...restWorker } = worker.toJSON();
      return { token, worker: restWorker };
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
