import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { UtilityFunctions } from 'src/utils/functions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkerDocument, Worker } from 'src/worker/schema/worker.schema';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import {
  ForgotPasswordDTO,
  UpdatePasswordDTO,
} from './dto/forgot-password.dto';
import {
  VerificationCode,
  VerificationCodeDocument,
} from './schema/verification-code.schema';
import { VerificationCodeType } from './enum/verification-code-type.enum';
import { VerificationCodeStatus } from './enum/verification-code-status.enum';
import { EmailService } from 'src/email/email.service';

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
    @InjectModel(VerificationCode.name)
    private readonly verificationCodeModel: Model<VerificationCodeDocument>,

    private readonly utilityFunctions: UtilityFunctions,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  throwError(err) {
    throw new HttpException(
      err?.message || 'Something went wrong.',
      err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  signPayload(payload): string {
    const token = sign(payload, this.configService.get('JWT_SECRET', ''), {
      expiresIn: '1d',
    });
    return token;
  }

  async login(dto: LoginDTO) {
    try {
      const worker = await this.workerModel
        .findOne({
          emailAddress: dto.email,
        })
        .select(['emailAddress', 'password', 'name', 'alterNo', 'role'])
        .populate<{ role: Partial<IRole> }>({ path: 'role', select: 'name' });
      if (!worker?._id) {
        throw new BadRequestException('Email address not registered.');
      }

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
      this.throwError(err);
    }
  }

  async forgotPassword(dto: ForgotPasswordDTO) {
    try {
      const worker = await this.workerModel
        .findOne({
          emailAddress: dto.email,
        })
        .select(['emailAddress', 'name']);
      if (!worker?._id) {
        throw new BadRequestException('Email address not registered.');
      }

      const code = this.utilityFunctions.randomCode();
      const verificationCode = await this.verificationCodeModel.create({
        code,
        entity: worker._id,
        expiryAt: Date.now() + 1000 * 60 * 10,
        type: VerificationCodeType.FORGOT_PASSWORD,
      });
      // await this.emailService.sendForgotPasswordCode({
      //   toEmail: `"${worker.name}" <${worker.emailAddress}>`,
      //   values: {
      //     fullName: `${worker.name}`,
      //     confirmationCode: verificationCode.code,
      //   },
      // });
      return {
        id: verificationCode._id,
        code: verificationCode.code,
      };
    } catch (err) {
      this.throwError(err);
    }
  }

  async updatePassword(dto: UpdatePasswordDTO) {
    try {
      const worker = await this.workerModel
        .findOne({
          emailAddress: dto.email,
        })
        .select(['emailAddress']);
      if (!worker?._id) {
        throw new BadRequestException('Email address not registered.');
      }
      console.log({
        _id: dto.id,
        code: dto.code,
        user: this.utilityFunctions.objectId(worker._id),
        expiryAt: { $gt: Date.now() },
        status: VerificationCodeStatus.PENDING,
      });
      const verificationCode = await this.verificationCodeModel.findOne({
        _id: dto.id,
        code: dto.code,
        entity: this.utilityFunctions.objectId(worker._id),
        expiryAt: { $gt: Date.now() },
        status: VerificationCodeStatus.PENDING,
      });
      if (!verificationCode?._id) {
        throw new BadRequestException('Invalid verification code.');
      }

      // update Password
      const cryptPass = await this.utilityFunctions.cryptPassword(dto.password);
      if (cryptPass?.error) {
        this.throwError(cryptPass.error);
      }

      await this.workerModel.findByIdAndUpdate(worker._id, {
        $set: {
          password: cryptPass.hashPassword,
        },
      });

      await this.verificationCodeModel.findByIdAndUpdate(verificationCode._id, {
        $set: {
          status: VerificationCodeStatus.VERIFIED,
        },
      });

      return {
        id: worker._id,
      };
    } catch (err) {
      this.throwError(err);
    }
  }
}
