import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CategoryModule } from 'src/category/category.module';
import { ExamModule } from 'src/exam/exam.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from 'src/middleware/upload.middleware';
@Module({
  imports: [
    CategoryModule,
    ExamModule,
    MulterModule.registerAsync({
      useClass: UploadMiddleware,
    })
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
