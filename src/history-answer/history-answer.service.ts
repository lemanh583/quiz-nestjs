import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryAnswer } from './history-answer.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class HistoryAnswerService {
    constructor(
        @InjectRepository(HistoryAnswer) private readonly repository: Repository<HistoryAnswer>,
    ) { }

    async findOne(condition: FindOneOptions<HistoryAnswer>): Promise<HistoryAnswer> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<HistoryAnswer>, data: Partial<HistoryAnswer>, options?: Omit<FindOneOptions<HistoryAnswer>, 'where'>): Promise<HistoryAnswer> {
        await this.repository.update(condition, data)
        return this.repository.findOne({ where: condition, ...options })
    }

    async save(data: any): Promise<HistoryAnswer> {
        const entity = Object.assign(new HistoryAnswer(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<HistoryAnswer>): Promise<HistoryAnswer[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<HistoryAnswer>): Promise<[HistoryAnswer[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<HistoryAnswer>): Promise<number> {
        return this.repository.count(condition)
    }
}
