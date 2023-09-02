import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Service } from 'src/aws/s3/s3.service';
import { OrganizationSchema } from 'src/organization/schema/organization.schema';
import { PostSchema } from 'src/post/schema/post.schema';
import { RoleSchema } from 'src/role/schema/role.schema';
import { UtilityFunctions } from 'src/utils/functions';
import { WorkerSchema } from './schema/worker.schema';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: 'Worker',
        schema: WorkerSchema,
      },
      {
        name: 'Role',
        schema: RoleSchema,
      },
      {
        name: 'Post',
        schema: PostSchema,
      },
      {
        name: 'Organization',
        schema: OrganizationSchema,
      },
    ]),
  ],
  providers: [WorkerService, UtilityFunctions, S3Service],
  controllers: [WorkerController],
})
export class WorkerModule {}
