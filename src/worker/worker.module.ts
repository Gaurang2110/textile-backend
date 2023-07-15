import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerSchema } from './schema/worker.schema';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { UtilityFunctions } from 'src/utils/functions';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Worker',
        schema: WorkerSchema,
      },
    ]),
  ],
  providers: [WorkerService, UtilityFunctions],
  controllers: [WorkerController],
})
export class WorkerModule {}
