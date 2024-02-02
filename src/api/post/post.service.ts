import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePostDto, CreatePostResponseDto } from './dto/create-post.dto';
import { IJwtPayload } from 'src/common/types/Jwt-payload.types';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(
    createPostDto: CreatePostDto,
    user: IJwtPayload,
  ): Promise<CreatePostResponseDto> {
    const result = await this.prismaService.post.create({
      data: {
        content: createPostDto.content,
        title: createPostDto.title,
        accountId: user.id,
        postImgTb: {
          createMany: {
            data: createPostDto.postImageUrls!.map((url) => ({
              postImg: url,
            })),
          },
        },
      },
      select: {
        id: true,
      },
    });

    return {
      postIdx: result.id,
    };
  }
}
