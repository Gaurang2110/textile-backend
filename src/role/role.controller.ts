import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller({
  path: 'role',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() role: CreateRoleDto) {
    const resp = await this.roleService.createRole(role);
    return { message: 'Role Created Successfully.', data: resp };
  }

  @Get()
  async getAllRoles() {
    const resp = await this.roleService.getAllRoles();
    return { message: 'Role Fetch Successfully.', data: resp };
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    const resp = await this.roleService.getRoleById(id);
    return { message: 'Post Fetch Successfully.', data: resp };
  }
}
