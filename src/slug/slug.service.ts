import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slug } from './slug.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Helper } from 'src/common/helper';
import { MessageError } from 'src/common/enum/error.enum';
import { CreateSlugDto } from './dto';
import { ResponseServiceInterface } from 'src/common/interface';
import { SlugType } from 'src/common/enum/slug.enum';
import { ExamService } from 'src/exam/exam.service';

@Injectable()
export class SlugService {
    constructor(
        @InjectRepository(Slug) private readonly repository: Repository<Slug>,
    ){}

    async findOne(condition: FindOneOptions<Slug>): Promise<Slug> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Slug>, data: Partial<Slug>, options?: Omit<FindOneOptions<Slug>, 'where'>): Promise<Slug> {
        await this.repository.update(condition, data)
        return this.repository.findOne({ where: condition, ...options })
    }

    async save(data: any): Promise<Slug> {
        const entity = Object.assign(new Slug(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Slug>): Promise<Slug[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Slug>): Promise<[Slug[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Slug>): Promise<number> {
        return this.repository.count(condition)
    }
    
    async handleSlug(slug: string, query: any): Promise<ResponseServiceInterface<any>> {
        let slugDB = await this.findOne({ where: { slug }})
        if (!slugDB) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let response: any
        // if (slugDB.type == SlugType.exam) {
            // let { error, data } = await this.examService.handleSlug(slug, query)
        // }

        return { error: null, data: response } 
    }

    async test () {
        return this.repository.save({
            slug: 'test',
            type: SlugType.category
        })
    }

}
