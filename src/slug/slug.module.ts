import { Module, forwardRef } from '@nestjs/common';
import { SlugService } from './slug.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slug } from './slug.entity';
import { SlugController } from './slug.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Slug]),
    ],
    controllers: [SlugController],
    providers: [
        SlugService
    ],
    exports: [
        SlugService
    ]
})
export class SlugModule {}
