import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ExamHistory } from './exam-history.entity';
import { PayloadTokenInterface, ResponseServiceInterface } from 'src/common/interface';
import { MessageError } from 'src/common/enum/error.enum';
import { Exam } from 'src/exam/exam.entity';
import { Helper } from 'src/common/helper';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';

@Injectable()
export class ExamHistoryService {
    constructor(
        @InjectRepository(ExamHistory)
        private readonly repository: Repository<ExamHistory>,
        @InjectRepository(Exam)
        private readonly examRepository: Repository<Exam>,
        @InjectRepository(HistoryAnswer)
        private readonly historyAnswerRepository: Repository<HistoryAnswer>,
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

    async getListHistory(slug: string, user: PayloadTokenInterface, query: any): Promise<ResponseServiceInterface<any>> {
        let { page, limit } = Helper.transformQueryList(query)
        let exam = await this.examRepository.findOne({ where: { slug: { slug } } })
        if (!exam || exam.hidden) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let [histories, total] = await this.findAndCount({
            where: {
                user_id: user.id,
                exam_id: exam.id
            },
            order: { created_at: "DESC" },
            take: limit,
            skip: (page - 1) * limit
        })
        histories = histories.map(item => {
            return {
                ...item,
                total_minute_work: Helper.calculateTimeWorkExam(item.start_time, item.end_time)
            }
        })
        return { error: null, data: { list: histories, total, page, limit } }
    }

    async detailHistory(historyId: number, user: PayloadTokenInterface, query: any): Promise<ResponseServiceInterface<any>> {
        let history = await this.findOne({ where: { id: historyId, user_id: user.id } })
        if (!history) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let { page, limit } = Helper.transformQueryList(query)
        let [histories, total] = await this.historyAnswerRepository
            .createQueryBuilder('ha')
            .leftJoinAndSelect('ha.question', 'q')
            .leftJoin('q.answers', 'a')
            .addSelect(["a.id", "a.title", "a.correct"])
            .where('ha.exam_history_id = :history_id', { history_id: history.id })
            .orderBy('ha.id', 'ASC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount()

        let newMap = histories.map(h => {
            h.question.answers.sort((a, b) => a.id - b.id)
            h.question.answers = h.question.answers.map((item) => {
                let newItem = {
                    ...item,
                    user_choose: +(h.answer_id) == item.id ? true : false
                }
                !history.end_time && (delete newItem.correct)
                return newItem
            })

            let newItemMap = {
                q_correct: h.correct,
                score: h.score,
                ...h.question,
                answers: h.question.answers,
            }
            if (!history.end_time) {
                delete newItemMap.q_correct
                delete newItemMap.score
            }
            return newItemMap
        })

        return { error: null, data: { history, list: newMap, total, page, limit } }
    }

}
