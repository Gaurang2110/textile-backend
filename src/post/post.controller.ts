import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller({
  path: 'post',
  version: '1',
})
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() post: CreatePostDto) {
    const resp = await this.postService.createPost(post);
    return { message: 'Post Created Successfully.', data: resp };
  }

  @Get()
  async getAllPosts() {
    const resp = await this.postService.getAllPosts();
    return { message: 'Post Fetch Successfully.', data: resp };
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    const resp = await this.postService.getPostById(id);
    return { message: 'Post Fetch Successfully.', data: resp };
  }
}
