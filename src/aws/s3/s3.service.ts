import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  client = null;
  modelBucket = this.configService.get('AWS_S3_MODEL_BUCKET', '');
  defaultExpire = this.configService.get('AWS_S3_DEFAULT_EXPIRE', 3600);
  defaultRegion = this.configService.get('AWS_DEFAULT_REGION', 'ap-south-1');
  accessKeyId = this.configService.get('TEXTILE_AWS_ACCESS_KEY_ID', '');
  secretAccessKey = this.configService.get('TEXTILE_AWS_SECRET_ACCESS_KEY', '');
  constructor(private readonly configService: ConfigService) {}

  async GetUploadURL(key: string, bucket: string, acl = 'private') {
    this.client = new S3({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      endpoint: `s3-${this.defaultRegion}.amazonaws.com`,
      signatureVersion: 'v4',
      region: this.defaultRegion,
    });
    const params = {
      Bucket: bucket || this.modelBucket,
      Key: key,
      Expires: Number(this.defaultExpire),
      ACL: acl,
    };

    return this.client.getSignedUrlPromise('putObject', params);
  }

  async GetDownloadURL(key: string, bucket: string) {
    this.client = new S3({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      endpoint: `s3.${this.defaultRegion}.amazonaws.com`,
      signatureVersion: 'v4',
      region: this.defaultRegion,
    });
    const params = {
      Bucket: bucket || this.modelBucket,
      Key: key,
      Expires: this.defaultExpire,
    };

    return this.client.getSignedUrlPromise('getObject', params);
  }

  GetPublicUrl(key: string, bucket = 'ngon-assets') {
    return `https://${bucket}.s3.${this.defaultRegion}.amazonaws.com/${key}`;
  }

  async DeleteS3Object(key: string, bucket: string) {
    this.client = new S3({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      endpoint: `s3-${this.defaultRegion}.amazonaws.com`,
      signatureVersion: 'v4',
      region: this.defaultRegion,
    });

    return new Promise((resolve, reject) => {
      this.client.deleteObject(
        { Key: key, Bucket: bucket },
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            console.log('Deleted S3 Object ---> ', key);
            resolve(data);
          }
        },
      );
    });
  }

  async CheckIfExists(key: string, bucket: string) {
    this.client = new S3({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      endpoint: `s3-${this.defaultRegion}.amazonaws.com`,
      signatureVersion: 'v4',
      region: this.defaultRegion,
    });
    const params = { Key: key, Bucket: bucket };

    try {
      await this.client.headObject(params).promise();
      const signedUrl = await this.client.getSignedUrl('getObject', params);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      } else {
        throw error;
        // Handle other errors here....
      }
    }
  }
}
