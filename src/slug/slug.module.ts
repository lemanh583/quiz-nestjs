import { Module } from '@nestjs/common';
import { SlugService } from './slug.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slug } from './slug.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Slug])
    ],
    providers: [
        SlugService
    ],
    exports: [
        SlugService
    ]
})
export class SlugModule {}
