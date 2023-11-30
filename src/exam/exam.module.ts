import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './exam.entity';
import { ExamController } from './exam.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from 'src/middleware/upload.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam]),
    MulterModule.registerAsync({
      useClass: UploadMiddleware,
    })
  ],
  controllers: [
    ExamController
  ],
  providers: [ExamService]
})
export class ExamModule {}
