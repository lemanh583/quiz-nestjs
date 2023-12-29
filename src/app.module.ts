import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { SlugModule } from './slug/slug.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { ExamHistoryModule } from './exam-history/exam-history.module';
import { ExamModule } from './exam/exam.module';
import { PostModule } from './post/post.module';
import { MediaModule } from './media/media.module';
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
import { AdminModule } from './admin/admin.module';
import { ExamQuestionModule } from './exam-question/exam-question.module';
import { ExamQuestion } from './exam-question/exam-question.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Package } from './package/package.entity';
import { Transaction } from './transaction/transaction.entity';
import { CategoryExam } from './category-exam/category-exam.entity';
import { SeederModule } from './seeder/seeder.module';
import { TransactionModule } from './transaction/transaction.module';
import { PackageModule } from './package/package.module';
import { TopicModule } from './topic/topic.module';
import { Topic } from './topic/topic.entity';
import { TagModule } from './tag/tag.module';
import { Tag } from './tag/tag.entity';

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
        Media,
        ExamQuestion,
        Package,
        Transaction,
        CategoryExam,
        Topic,
        Tag
      ],
      synchronize: true,
      // logging: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/static'
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    QuestionModule,
    AnswerModule,
    ExamHistoryModule,
    ExamModule,
    SlugModule,
    PostModule,
    MediaModule,
    HistoryAnswerModule,
    AdminModule,
    ExamQuestionModule,
    SeederModule,
    TransactionModule,
    PackageModule,
    TopicModule,
    TagModule,
  ],
})
export class AppModule { }
