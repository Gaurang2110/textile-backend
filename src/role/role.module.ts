import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleSchema } from './schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Role',
        schema: RoleSchema,
      },
    ]),
  ],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
