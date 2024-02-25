import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { SlugService } from './slug.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slug } from './slug.entity';
import { SlugController } from './slug.controller';
import { CategoryModule } from 'src/category/category.module';
import { ExamModule } from 'src/exam/exam.module';
import { JwtMiddleware } from 'src/common/middleware/jwt.middleware';
import { TransactionModule } from 'src/transaction/transaction.module';
import { PostModule } from 'src/post/post.module';
import { TopicModule } from 'src/topic/topic.module';
import { ExamHistoryModule } from 'src/exam-history/exam-history.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Slug]),
        CategoryModule,
        ExamModule,
        TransactionModule,
        PostModule,
        TopicModule,
        ExamHistoryModule,
        UserModule
    ],
    controllers: [SlugController],
    providers: [
        SlugService
    ],
    exports: [
        SlugService
    ]
})
export class SlugModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(JwtMiddleware).forRoutes('/:slug');
    }
  }
