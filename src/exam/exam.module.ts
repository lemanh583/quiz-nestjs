import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './exam.entity';
import { ExamController } from './exam.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from 'src/middleware/upload.middleware';
import { SlugModule } from 'src/slug/slug.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam]),
    MulterModule.registerAsync({
      useClass: UploadMiddleware,
    }),
    SlugModule,
    CategoryModule
  ],
  controllers: [
    ExamController
  ],
  providers: [ExamService],
  exports: [ExamService]
})
export class ExamModule {}
