import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerSchema } from 'src/worker/schema/worker.schema';
import { UtilityFunctions } from 'src/utils/functions';
import { VerificationCodeSchema } from './schema/verification-code.schema';
import { EmailService } from 'src/email/email.service';
import { LastLoginSchema } from './schema/last_login.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Worker',
        schema: WorkerSchema,
      },
      {
        name: 'VerificationCode',
        schema: VerificationCodeSchema,
      },
      {
        name: 'LastLogin',
        schema: LastLoginSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UtilityFunctions, EmailService],
})
export class AuthModule {}
