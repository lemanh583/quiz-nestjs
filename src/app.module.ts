import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
// import { AuthController } from './auth/auth.controller';
// import { AuthModule } from './auth/auth.module';
// import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { SlugController } from './slug/slug.controller';
import { SlugService } from './slug/slug.service';
import { SlugModule } from './slug/slug.module';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { QuestionModule } from './question/question.module';
import { AnswerController } from './answer/answer.controller';
import { AnswerModule } from './answer/answer.module';
import { HistoryController } from './exam-history/exam-history.controller';
import { HistoryModule } from './exam-history/exam-history.module';
import { ExamController } from './exam/exam.controller';
import { ExamModule } from './exam/exam.module';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { MediaController } from './media/media.controller';
import { MediaModule } from './media/media.module';
import { HistoryAnswerController } from './history-answer/history-answer.controller';
import { HistoryAnswerModule } from './history-answer/history-answer.module';
import { Slug } from './slug/slug.entity';
import { Category } from './category/category.entity';
import { Exam } from './exam/exam.entity';
import { Question } from './question/question.entity';
import { Answer } from './answer/answer.entity';
import { Post } from './post/post.entity';
import { ExamHistory } from './exam-history/exam-history.entity';
import { HistoryAnswer } from './history-answer/history-answer.entity';
import { Media } from './media/media.entity';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from './middleware/upload.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Slug,
        Category,
        Exam,
        Question,
        Answer,
        Post,
        ExamHistory,
        HistoryAnswer,
        Media
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    SlugModule,
    QuestionModule,
    AnswerModule,
    HistoryModule,
    ExamModule,
    PostModule,
    MediaModule,
    HistoryAnswerModule,
    AdminModule,
    // MulterModule.registerAsync({
    //   useClass: UploadMiddleware,
    // })
  ],
  // controllers: [SlugController, QuestionController, AnswerController, HistoryController, ExamController, PostController, MediaController, HistoryAnswerController],
  // providers: [],
  // controllers: [UserController, AuthController],
})
export class AppModule { }
