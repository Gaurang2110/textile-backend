import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerSchema } from 'src/worker/schema/worker.schema';
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
  controllers: [AuthController],
  providers: [AuthService, UtilityFunctions],
})
export class AuthModule {}
