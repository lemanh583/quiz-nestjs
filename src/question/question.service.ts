import { Injectable } from '@nestjs/common';
import { Question } from './question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question) private readonly repository: Repository<Question>,
    ) { }

    async findOne(condition: FindOneOptions<Question>): Promise<Question> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Question>, data: Partial<Question>, options?: Omit<FindOneOptions<Question>, 'where'>): Promise<Question> {
        await this.repository.update(condition, data)
        return this.repository.findOne({ where: condition, ...options })
    }

    async save(data: any): Promise<Question> {
        const entity = Object.assign(new Question(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Question>): Promise<Question[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Question>): Promise<[Question[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Question>): Promise<number> {
        return this.repository.count(condition)
    }
}

