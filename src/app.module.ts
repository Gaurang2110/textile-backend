import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { OrganizationModule } from './organization/organization.module';
import { PostModule } from './post/post.module';
import { WorkerModule } from './worker/worker.module';
import { AwsModule } from './aws/aws.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        console.log('url', configService.get('MONGO_URI', ''));
        return {
          connectionFactory: (connection) => {
            if (connection.readyState === 1) {
              console.log('Textile Backend DB Connected Successfully');
            }
            connection.on('disconnected', () => {
              console.log('DB disconnected');
            });
            connection.on('error', (error) => {
              console.log('DB connection failed! for error: ', error);
            });
            return connection;
          },
          uri: configService.get('MONGO_URI', ''),
          useNewUrlParser: true,
          useUnifiedTopology: true
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    OrganizationModule,
    PostModule,
    WorkerModule,
    AwsModule,
    RoleModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
