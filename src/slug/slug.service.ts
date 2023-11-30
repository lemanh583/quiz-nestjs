import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slug } from './slug.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Helper } from 'src/common/helper';
import { MessageError } from 'src/common/enum/error.enum';
import { CreateSlugDto } from './dto';

@Injectable()
export class SlugService {
    constructor(
        @InjectRepository(Slug) private readonly slugRepository: Repository<Slug>
    ){}

    async findOne(condition: FindOneOptions<Slug>): Promise <Slug> {
        return this.slugRepository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Slug>, data: Slug): Promise <Slug> {
        let user = await this.slugRepository.findOneBy(condition)
        let updateData = Object.assign(user, data) 
        return this.slugRepository.save(updateData);
    }

    async save(data: CreateSlugDto): Promise<Slug> {
        const entity = Object.assign(new Slug(), data);
        return this.slugRepository.save(entity);
    }

    async findAll(): Promise<Slug[]> {
        return this.slugRepository.find()
    }

    async count(condition: FindManyOptions<Slug>): Promise<number> {
        return this.slugRepository.count(condition)
    }
    
}
