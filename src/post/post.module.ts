import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostController } from './post.controller';
import { Slug } from 'src/slug/slug.entity';
import { Topic } from 'src/topic/topic.entity';
import { Tag } from 'src/tag/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Topic, Slug, Tag])
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule { }
