import { Injectable } from '@nestjs/common';
import { ExamQuestion } from './exam-question.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExamQuestionService {
    constructor(
        @InjectRepository(ExamQuestion) private readonly repository: Repository<ExamQuestion>,
    ) { }

    async findOne(condition: FindOneOptions<ExamQuestion>): Promise<ExamQuestion> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<ExamQuestion>, data: Partial<ExamQuestion>, options?: Omit<FindOneOptions<ExamQuestion>, 'where'>): Promise<ExamQuestion> {
        await this.repository.update(condition, data)
        return this.repository.findOne({ where: condition, ...options })
    }

    async save(data: any): Promise<ExamQuestion> {
        const entity = Object.assign(new ExamQuestion(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<ExamQuestion>): Promise<ExamQuestion[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<ExamQuestion>): Promise<[ExamQuestion[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count({ where = {}, ...args }: FindManyOptions<ExamQuestion>): Promise<number> {
        return this.repository.count({
            where,
            ...args
        })
    }
}
