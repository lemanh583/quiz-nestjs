import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CategoryModule } from 'src/category/category.module';
import { ExamModule } from 'src/exam/exam.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from 'src/common/middleware/upload.middleware';
import { QuestionModule } from 'src/question/question.module';
import { AnswerModule } from 'src/answer/answer.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { MediaModule } from 'src/media/media.module';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
import { TopicModule } from 'src/topic/topic.module';
import { TagModule } from 'src/tag/tag.module';
@Module({
  imports: [
    CategoryModule,
    ExamModule,
    QuestionModule,
    AnswerModule,
    TransactionModule,
    MediaModule,
    PostModule,
    UserModule,
    TopicModule,
    TagModule,
    MulterModule.registerAsync({
      useClass: UploadMiddleware,
    })
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
