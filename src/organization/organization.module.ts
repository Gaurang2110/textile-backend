import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationSchema } from './schema/organization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Organization',
        schema: OrganizationSchema,
      },
    ]),
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
