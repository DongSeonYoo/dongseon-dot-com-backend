import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, CreatePostResponseDto } from './dto/create-post.dto';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { User } from 'src/common/decorator/user.decorator';
import { IJwtPayload } from 'src/common/types/Jwt-payload.types';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from 'src/common/common-response';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ type: CreatePostResponseDto })
  @Post()
  @UseGuards(JwtAccessGuard)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @User() user: IJwtPayload,
  ) {
    const result = await this.postService.createPost(createPostDto, user);

    return ResponseEntity.SUCCESS_WITH(result);
  }
}
