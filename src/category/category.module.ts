import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryController } from './category.controller';
import { Slug } from 'src/slug/slug.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Slug]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [ CategoryService ]
})
export class CategoryModule {}
