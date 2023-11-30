import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class AnswerService {
    constructor(@InjectRepository(Answer) private readonly repository: Repository<Answer>) { }

    async findOne(condition: FindOneOptions<Answer>): Promise<Answer> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Answer>, data: Answer): Promise<Answer> {
        let record = await this.repository.findOneBy(condition)
        let updateRecord = Object.assign(record, data)
        return this.repository.save(updateRecord);
    }

    async save(data: any): Promise<Answer> {
        const entity = Object.assign(new Answer(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Answer>): Promise<Answer[]> {
        return this.repository.find({
            where: { deleted_at: null, ...where },
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Answer>): Promise<[Answer[], number]> {
        return this.repository.findAndCount({
            where: { deleted_at: null, ...where },
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Answer>): Promise<number> {
        return this.repository.count(condition)
    }

}
