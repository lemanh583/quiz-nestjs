import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ExamHistory } from './exam-history.entity';

@Injectable()
export class ExamHistoryService {
    constructor(
        @InjectRepository(ExamHistory) private readonly repository: Repository<ExamHistory>,
    ) { }

    async findOne(condition: FindOneOptions<ExamHistory>): Promise<ExamHistory> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<ExamHistory>, data: Partial<ExamHistory>, options?: Omit<FindOneOptions<ExamHistory>, 'where'>): Promise<ExamHistory> {
        await this.repository.update(condition, data)
        return this.repository.findOne({ where: condition, ...options })
    }

    async save(data: any): Promise<ExamHistory> {
        const entity = Object.assign(new ExamHistory(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<ExamHistory>): Promise<ExamHistory[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<ExamHistory>): Promise<[ExamHistory[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<ExamHistory>): Promise<number> {
        return this.repository.count(condition)
    }
}
