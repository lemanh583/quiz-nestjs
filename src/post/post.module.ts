import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostController } from './post.controller';
import { Category } from 'src/category/category.entity';
import { Slug } from 'src/slug/slug.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, Slug])
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule { }
