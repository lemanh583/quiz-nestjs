import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { SlugService } from './slug.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slug } from './slug.entity';
import { SlugController } from './slug.controller';
import { CategoryModule } from 'src/category/category.module';
import { ExamModule } from 'src/exam/exam.module';
import { JwtMiddleware } from 'src/middleware/jwt.middleware';
import { TransactionModule } from 'src/transaction/transaction.module';
import { PostModule } from 'src/post/post.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Slug]),
        CategoryModule,
        ExamModule,
        TransactionModule,
        PostModule
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
