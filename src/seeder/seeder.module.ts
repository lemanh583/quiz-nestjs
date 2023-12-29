import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Package } from 'src/package/package.entity';
import { Tag } from 'src/tag/tag.entity';
import { TopicModule } from 'src/topic/topic.module';
import { ExamService } from 'src/exam/exam.service';
import { ExamModule } from 'src/exam/exam.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([User, Package, Tag]),
      TopicModule,
      ExamModule,
  ],
  providers: [SeederService]
})
export class SeederModule {}
