import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { readFileSync } from 'fs';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { extname, join } from 'path';
import { create } from 'pdf-creator-node';
import { S3Service } from 'src/aws/s3/s3.service';
import {
  Organization,
  OrganizationDocument,
} from 'src/organization/schema/organization.schema';
import { Post, PostDocument } from 'src/post/schema/post.schema';
import { Role, RoleDocument } from 'src/role/schema/role.schema';
import { UtilityFunctions } from 'src/utils/functions';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { MediaAction, WorkerImageDTO } from './dto/worker-image.dto';
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
  ) {}
  async createWorker(worker: CreateWorkerDto, isEdit = false) {
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
      let workerData;
      if (isEdit) {
        console.log('worker', worker.workerNo);
        workerData = await this.WorkerModel.findOne({
          workerNo: worker.workerNo,
        });

        if (!workerData?._id) {
          throw new HttpException('Worker not found', HttpStatus.BAD_REQUEST);
        }
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

      if (worker.joiningDate) {
        if (!moment(worker.joiningDate).isValid()) {
          throw new HttpException(
            'Invalid Joining Date',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          worker.joiningDate = moment(worker.joiningDate).format('DD MMM YYYY');
        }
      }

      if (worker.dateOfBirth) {
        if (!moment(worker.dateOfBirth).isValid()) {
          throw new HttpException(
            'Invalid Joining Date',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          worker.dateOfBirth = moment(worker.dateOfBirth).format('DD MMM YYYY');
        }
      }

      let wokerUpdated;
      if (isEdit) {
        const data = workerData.toJSON();
        wokerUpdated = await this.WorkerModel.findOneAndUpdate(
          {
            workerNo: worker.workerNo,
          },
          {
            $set: {
              ...data,
              ...worker,
              emailAddress: data.emailAddress,
            },
          },
        );
      } else {
        wokerUpdated = await this.WorkerModel.create({
          ...worker,
          password: cryptPass.hashPassword,
          mpassword:defaultPassword
        });
        await wokerUpdated.save();
      }

      const workerResp = (
        await this.WorkerModel.findById(wokerUpdated._id).populate([
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
      const key = `org/${dto.company}/${dto.workerNo}/${dto.type}${extension}`;
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

  async createPDFFile(document, options, workerDetails) {
    return new Promise((resolve, reject) => {
      create(document, options)
        .then(async (res: Buffer) => {
          const key = `org/${workerDetails.company._id}/${workerDetails.aadharNo}/${workerDetails._id}_worker.pdf`;
          const bucket = 'textile-user-images';
          const { Location }: Record<string, any> = await this.s3Service.upload(
            res,
            bucket,
            key,
            'public-read',
          );
          resolve({ url: Location });
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  async createWorkerPDF(id: string) {
    try {
      const workerDetails = (
        await this.WorkerModel.findById(id).populate([
          { path: 'post', select: 'name' },
          { path: 'role', select: 'name' },
          { path: 'company', select: 'name' },
        ])
      ).toJSON();
      if (!workerDetails?._id) {
        throw new HttpException('Worker not found', HttpStatus.BAD_REQUEST);
      }

      const options = {
        format: 'A3',
        orientation: 'portrait',
        border: '10mm',
      };
      const html = readFileSync(
        join(__dirname, '../templates/worker-pdf.html'),
        'utf8',
      );

      const document = {
        html: html,
        data: {
          workerNo: workerDetails?.workerNo ?? 'N/A',
          machineNo: workerDetails?.machineNo ?? 'N/A',
          alterNo: workerDetails?.alterNo ?? 'N/A',
          joiningDate: workerDetails?.joiningDate ?? 'N/A',
          name: workerDetails?.name ?? 'N/A',
          reference: workerDetails?.reference ?? 'N/A',
          mobileNo: workerDetails?.mobileNo ?? 'N/A',
          aadharNo: workerDetails?.aadharNo ?? 'N/A',
          emailAddress: workerDetails?.emailAddress ?? 'N/A',
          role: workerDetails?.role?.['name'] ?? 'N/A',
          post: workerDetails?.post?.['name'] ?? 'N/A',
          company: workerDetails?.company?.['name'] ?? 'N/A',
          ifscCode: workerDetails?.bankDetails?.ifscCode ?? 'N/A',
          bankAccountName: workerDetails?.bankDetails?.bankAccountName ?? 'N/A',
          bankAccountNumber: workerDetails?.bankDetails?.bankAccountNumber ?? 'N/A',
          status: workerDetails?.status ?? 'N/A',
          profile:
            workerDetails?.profile ??
            'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg',
          aadharCard:
            workerDetails?.aadharCard ??
            'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg',
          aadharCardBack:
            workerDetails?.aadharCardBack ??
            'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg',
          bankPassbook:
            workerDetails?.bankPassbook ??
            'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&ext=jpg',
        },
        path: '',
        type: 'buffer',
      };

      return await this.createPDFFile(document, options, workerDetails);
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

  async deleteWorker (id:any) {
    try {
      const worker = await this.WorkerModel.findOneAndDelete({_id : id})
      return worker
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateWorker (worker:any) {
    try {
      let workerData;
        workerData = await this.WorkerModel.findOne({
          workerNo: worker.workerNo,
        });

        if (!workerData?._id) {
          throw new HttpException('Worker not found', HttpStatus.BAD_REQUEST);
        }
        let wokerUpdated;

        wokerUpdated = await this.WorkerModel.findOneAndUpdate(
          {
            workerNo: worker.workerNo,
          },
          {
            $set: {
              ...worker,
            },
          },
          );
          workerData = await this.WorkerModel.findOne({
            workerNo: worker.workerNo,
          });
          return workerData
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
    
}
