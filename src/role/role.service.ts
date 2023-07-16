import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role, RoleDocument } from './schema/role.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly RoleModel: Model<RoleDocument>,
  ) {}

  async createRole(org: CreateRoleDto) {
    try {
      const { name } = org;
      const roleCreated = await this.RoleModel.create({
        name,
      });
      await roleCreated.save();
      return roleCreated;
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllRoles() {
    try {
      return this.RoleModel.find({});
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRoleById(id: string) {
    try {
      let org = await this.RoleModel.findById(id);
      if (!org) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
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
