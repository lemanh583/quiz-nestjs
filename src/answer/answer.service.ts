import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateAnswerDto, UpdateAnswerDto } from './dto';
import { ResponseServiceInterface } from 'src/common/interface';
import { Question } from 'src/question/question.entity';
import { MessageError } from 'src/common/enum/error.enum';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer) 
        private readonly repository: Repository<Answer>,
        @InjectRepository(Question) 
        private readonly questionRepository: Repository<Question>,
    ) { }

    async findOne(condition: FindOneOptions<Answer>): Promise<Answer> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Answer>, data: Partial<Answer>, options?: Omit<FindOneOptions<Answer>, 'where'>): Promise<Answer> {
        await this.repository.update(condition, data)
        return this.repository.findOne({ where: condition, ...options })
    }

    async save(data: any): Promise<Answer> {
        const entity = Object.assign(new Answer(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Answer>): Promise<Answer[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Answer>): Promise<[Answer[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Answer>): Promise<number> {
        return this.repository.count(condition)
    }

    async createAnswer(body: CreateAnswerDto): Promise<ResponseServiceInterface<any>> {
        let { title, correct, question_id } = body
        let question = await this.questionRepository.findOne({ where: { id: question_id } })
        if (!question) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let answer = await this.save({
            title,
            correct,
            question
        })
        return { error: null, data: answer }
    }

    async updateAnswer(answer_id: number, body: UpdateAnswerDto): Promise<ResponseServiceInterface<any>> {
        let { title, correct } = body
        let answer = await this.findOne({ where: { id: answer_id } })
        if (!answer) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        if (title) answer.title = title
        if (correct != undefined) answer.correct = correct
        await this.save(answer)
        return { error: null, data: answer }
    }
}
