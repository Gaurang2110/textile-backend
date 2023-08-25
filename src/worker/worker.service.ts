import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { extname } from 'path';
import { S3Service } from 'src/aws/s3/s3.service';
import {
  Organization,
  OrganizationDocument,
} from 'src/organization/schema/organization.schema';
import { Post, PostDocument } from 'src/post/schema/post.schema';
import { Role, RoleDocument } from 'src/role/schema/role.schema';
import { UtilityFunctions } from 'src/utils/functions';
import { CreateWorkerDto } from './dto/create-worker.dto';
import {
  MediaAction,
  WorkerDierctImageDTO,
  WorkerImageDTO,
} from './dto/worker-image.dto';
import { Worker, WorkerDocument } from './schema/worker.schema';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Worker.name)
    private readonly WorkerModel: Model<WorkerDocument>,
    @InjectModel(Post.name)
    private readonly PostModel: Model<PostDocument>,
    @InjectModel(Role.name)
    private readonly RoleModel: Model<RoleDocument>,
    @InjectModel(Organization.name)
    private readonly OrgModel: Model<OrganizationDocument>,
    private readonly s3Service: S3Service,
    private readonly utilityFunctions: UtilityFunctions,
    private readonly httpService: HttpService,
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
          cryptPass?.error?.status || HttpStatus.BAD_REQUEST,
        );
      }
      const postExists = await this.PostModel.exists({ _id: worker.post });

      if (!postExists) {
        throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
      }
      const roleExists = await this.RoleModel.exists({ _id: worker.role });

      if (!roleExists) {
        throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
      }

      const orgExists = await this.OrgModel.exists({ _id: worker.company });

      if (!orgExists) {
        throw new HttpException('Company not found', HttpStatus.BAD_REQUEST);
      }
      const workerObj = await this.WorkerModel.create({
        ...worker,
        password: cryptPass.hashPassword,
      });
      await workerObj.save();
      const workerResp = (
        await this.WorkerModel.findById(workerObj._id).populate([
          { path: 'post', select: 'name' },
          { path: 'role', select: 'name' },
          { path: 'company', select: 'name' },
        ])
      ).toJSON();
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
      return this.WorkerModel.find({}).populate([
        { path: 'post', select: 'name' },
        { path: 'role', select: 'name' },
        { path: 'company', select: 'name' },
        { path: 'workers' },
      ]);
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWorkerInintialId() {
    try {
      // 010720200001
      let initialWorkerId = '010720200000';
      const worker = await this.WorkerModel.find({})
        .sort({ workerNo: -1 })
        .limit(1);
      if (worker?.[0]?.workerNo) {
        initialWorkerId = worker?.[0].workerNo;
      }
      return {
        workerNo: +initialWorkerId + 1,
      };
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadImages(dto: WorkerImageDTO) {
    try {
      const extension = extname(dto.fileName).toLowerCase() || '.png';
      const key = `org/${dto.company}/${dto.alterNo}/${dto.type}${extension}`;
      const acl = 'public-read';
      const bucket = 'textile-user-images';

      if (dto.action === MediaAction.SIGNED_URL) {
        const url = await this.s3Service.GetUploadURL(key, bucket, acl);
        return { url };
      } else if (dto.action === MediaAction.GET_LINK) {
        const isExists = await this.s3Service.CheckIfExists(key, bucket);
        if (!isExists) {
          throw new HttpException(
            'Image not Exist, Please upload first.',
            HttpStatus.BAD_REQUEST,
          );
        }
        const url = await this.s3Service.GetPublicUrl(key, bucket);
        return { url };
      }
      return { url: '' };
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async uploadWorkerImage(
  //   file: Express.Multer.File,
  //   dto: WorkerDierctImageDTO,
  // ) {
  //   try {
  //     const extension = extname(dto.fileName).toLowerCase() || '.png';
  //     const key = `org/${dto.company}/${dto.alterNo}/${dto.type}${extension}`;
  //     const acl = 'public-read';
  //     const bucket = 'textile-user-images';

  //     const { Location }: Record<string, any> = await this.s3Service.upload(
  //       file,
  //       bucket,
  //       key,
  //       acl,
  //     );
  //     return { url: Location };
  //   } catch (err) {
  //     console.log(err);
  //     console.log(err.stack);
  //     throw new HttpException(
  //       err?.message || 'Something went wrong.',
  //       err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
