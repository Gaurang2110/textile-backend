import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './schema/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly PostModel: Model<PostDocument>,
  ) {}

  async createPost(org: CreatePostDto) {
    try {
      const { name } = org;
      const orgCreated = await this.PostModel.create({
        name,
      });
      await orgCreated.save();
      return orgCreated;
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPosts() {
    try {
      return this.PostModel.find({});
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPostById(id: string) {
    try {
      let org = await this.PostModel.findById(id);
      if (!org) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      org = await org.toJSON();
      return org;
    } catch (err) {
      throw new HttpException(
        err?.message || 'Something went wrong.',
        err?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
