import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {
  Organization,
  OrganizationDocument,
} from './schema/organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly OrganizationModel: Model<OrganizationDocument>,
  ) {}

  async createOrganization(org: CreateOrganizationDto) {
    try {
      const { name } = org;
      const orgCreated = await this.OrganizationModel.create({
        name,
      });
      await orgCreated.save();
      return orgCreated;
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllOrganizations() {
    try {
      return this.OrganizationModel.find({});
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrganizationById(id: string) {
    try {
      let org = await this.OrganizationModel.findById(id);
      if (!org) {
        throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
      }
      org = await org.toJSON();
      return org;
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
