import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { MediaController } from './media.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media])
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
