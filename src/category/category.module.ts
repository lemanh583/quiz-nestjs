import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { SlugModule } from 'src/slug/slug.module';
import { CategoryController } from './category.controller';

@Module({
  imports: [
    SlugModule,
    TypeOrmModule.forFeature([Category]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}
