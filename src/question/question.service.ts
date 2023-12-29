import { Injectable } from '@nestjs/common';
import { Question } from './question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Like, Repository, SelectQueryBuilder } from 'typeorm';
import { ResponseServiceInterface } from 'src/common/interface';
import { Exam } from 'src/exam/exam.entity';
import { MessageError } from 'src/common/enum/error.enum';
import { Answer } from 'src/answer/answer.entity';
import { AddMultipleQuestionDto, CreateQuestionDto, UpdateQuestionDto } from './dto';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { FilterExamDto } from 'src/exam/dto';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private readonly repository: Repository<Question>,
        @InjectRepository(Exam)
        private readonly examRepository: Repository<Exam>,
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
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

    async createQuestion(body: CreateQuestionDto): Promise<ResponseServiceInterface<any>> {
        let { title, recommend, exam_id } = body
        let exam = await this.examRepository.findOne({ where: { id: exam_id } })
        if (!exam) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let question = await this.save({
            title,
            recommend,
            exam
        })
        return { error: null, data: question }
    }

    async addMultipleQuestion(exam_id: number, body: AddMultipleQuestionDto): Promise<ResponseServiceInterface<any>> {
        let { questions } = body
        let exam = await this.examRepository.findOne({ where: { id: exam_id } })
        if (!exam) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let ids = await Promise.all(
            questions.map(async (question) => {
                let question_db = await this.save({
                    title: question.title,
                    recommend: question.recommend,
                    exam,
                })
                for (let answer of question.answers) {
                    await this.answerRepository.save({
                        title: answer.title,
                        correct: answer.correct,
                        question: question_db
                    })
                }
                return question_db.id
            })
        )
        return { error: null, data: { message: "Done!", total_insert: ids.length } }
    }

    async updateQuestion(question_id: number, body: UpdateQuestionDto): Promise<ResponseServiceInterface<any>> {
        let { title, recommend } = body
        let question = await this.findOne({ where: { id: question_id } })
        if (!question) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        if (title) question.title = title
        if (recommend) question.recommend = recommend
        await this.save(question)
        return { error: null, data: question }
    }

    async deleteQuestion(question_id: number): Promise<ResponseServiceInterface<any>> {
        let question = await this.findOne({ where: { id: question_id } })
        if (!question) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        await this.repository.delete({ id: question_id })
        return { error: null, data: { message: "Done!" } }
    }

    async listQuestion(payload: BaseListFilterDto<any, any>, display_correct?: boolean): Promise<ResponseServiceInterface<any>> {
        let { limit = 10, page = 1 } = payload
        let fieldAnswer = ["a.id", "a.title"]
        display_correct && (fieldAnswer.push("a.correct"))
        let query = this.repository
            .createQueryBuilder("e")
            .leftJoin("e.exam_questions", "eq")
            .addSelect(["eq.id", "eq.exam_id"])
            .leftJoin("e.answers", "a")
            .addSelect(fieldAnswer)
        this.handleFilter(query, payload, page, limit)
        let [list, total] = await query.getManyAndCount()
        return {
            error: null,
            data: {
                list,
                total,
                page,
                limit,
            }
        }
    }

    handleFilter(query: SelectQueryBuilder<Question>, payload: BaseListFilterDto<any, any>, page: number, limit: number): any {
        if (payload.search) {
            query.andWhere("e.title LIKE :search", { search: `%${payload.search}%` })
        }
        if (payload?.filter?.type) {
            query.andWhere("e.type = :type", { type: payload.filter.type })
        }
        if (payload?.filter?.exam_id) {
            query.andWhere("eq.exam_id = :exam_id", { exam_id: payload?.filter?.exam_id })
        }
        let sorts = Object.keys(payload?.sort || {})
        if (sorts.length > 0) {
            sorts.forEach(key => {
                query.addOrderBy(`e.${key}`, payload?.sort[key]);
            })
        } else {
            query.orderBy("e.created_at", "DESC")
        }
        query.take(limit)
        query.skip((page - 1) * limit)
        return query
    }

}

