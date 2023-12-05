import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { SlugModule } from 'src/slug/slug.module';
import { CategoryController } from './category.controller';
import { Slug } from 'src/slug/slug.entity';

@Module({
  imports: [
    SlugModule,
    TypeOrmModule.forFeature([Category, Slug]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [ CategoryService ]
})
export class CategoryModule {}
