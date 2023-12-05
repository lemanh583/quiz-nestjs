import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CategoryModule } from 'src/category/category.module';
import { ExamModule } from 'src/exam/exam.module';
@Module({
  imports: [
    CategoryModule,
    ExamModule
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
