import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';

@Controller({
  path: 'organization',
  version: '1',
})
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async createOrganization(@Body() org: CreateOrganizationDto) {
    const resp = await this.organizationService.createOrganization(org);
    return { message: 'Organization Created Successfully.', data: resp };
  }

  @Get()
  async getAllOrganizations() {
    const resp = await this.organizationService.getAllOrganizations();
    return { message: 'Organization Fetch Successfully.', data: resp };
  }

  @Get(':id')
  async getOrganizationById(@Param('id') id: string) {
    const resp = await this.organizationService.getOrganizationById(id);
    return { message: 'Organization Fetch Successfully.', data: resp };
  }
}
