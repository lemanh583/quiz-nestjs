import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { ExamHistory } from './exam-history.entity';
import { PayloadTokenInterface, ResponseServiceInterface } from 'src/common/interface';
import { MessageError } from 'src/common/enum/error.enum';
import { Exam } from 'src/exam/exam.entity';
import { Helper } from 'src/common/helper';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';
import { Topic } from 'src/topic/topic.entity';
import { ExamType } from 'src/common/enum/exam.enum';

@Injectable()
export class ExamHistoryService {
    constructor(
        @InjectRepository(ExamHistory)
        private readonly repository: Repository<ExamHistory>,
        @InjectRepository(Exam)
        private readonly examRepository: Repository<Exam>,
        @InjectRepository(HistoryAnswer)
        private readonly historyAnswerRepository: Repository<HistoryAnswer>,
        @InjectRepository(Topic)
        private readonly topicRepository: Repository<Topic>,
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

    async getListHistory(id: number, user_id: number, query: any): Promise<ResponseServiceInterface<any>> {
        let { page, limit } = Helper.transformQueryList(query)
        let exam = await this.examRepository.findOne({ where: { id } })
        if (!exam || exam.hidden) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let [histories, total] = await this.findAndCount({
            where: {
                user_id: user_id,
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

    async detailHistory(history_id: number, user_id: number, query: any): Promise<ResponseServiceInterface<any>> {
        let history = await this.findOne({ where: { id: history_id, user_id: user_id } })
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

        let new_map = histories.map(h => {
            h.question.answers.sort((a, b) => a.id - b.id)
            h.question.answers = h.question.answers.map((item) => {
                let new_item = {
                    ...item,
                    user_choose: +(h.answer_id) == item.id ? true : false
                }
                !history.end_time && (delete new_item.correct)
                return new_item
            })

            let new_item_map = {
                q_correct: h.correct,
                score: h.score,
                ...h.question,
                answers: h.question.answers,
            }
            if (!history.end_time) {
                delete new_item_map.q_correct
                delete new_item_map.score
            }
            return new_item_map
        })
        return {
            error: null, data: {
                history: {
                    ...history,
                    total_minute_work: Helper.calculateTimeWorkExam(history.start_time, history.end_time)
                },
                list: new_map,
                total,
                page,
                limit
            }
        }
    }

    async getListHistoryForTopic(slug: string, user_decode: PayloadTokenInterface, query: any): Promise<ResponseServiceInterface<any>> {
        let { page, limit } = Helper.transformQueryList(query)
        let topic = await this.topicRepository.findOne({ where: { slug: { slug } } })
        if (!topic) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let exams = await this.examRepository.find({
            where: {
                user_id: user_decode.id,
                type: ExamType.auto,
                topic_id: topic.id
            },
            order: {
                id: "DESC"
            },
            select: ["id"]
        })
        let exam_ids = exams.map(i => i.id)
        let [list, total] = await this.repository.findAndCount({
            where: {
                user_id: user_decode.id,
                exam_id: In(exam_ids)
            },
            take: limit,
            skip: (page - 1) * limit
        })
        list = list.map(item => {
            return {
                ...item,
                total_minute_work: Helper.calculateTimeWorkExam(item.start_time, item.end_time)
            }
        })
        return { error: null, data: { list, total, page, limit } }
    }

}
