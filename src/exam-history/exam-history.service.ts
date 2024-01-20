import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In, IsNull, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { ExamHistory } from './exam-history.entity';
import { PayloadTokenInterface, ResponseServiceInterface } from 'src/common/interface';
import { MessageError } from 'src/common/enum/error.enum';
import { Exam } from 'src/exam/exam.entity';
import { Helper } from 'src/common/helper';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';
import { Topic } from 'src/topic/topic.entity';
import { ExamType } from 'src/common/enum/exam.enum';
import { BaseListFilterDto } from 'src/common/base/base.list';

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
        if(exam_ids.length == 0) {
            return  { error: null, data: { list: [], total: 0, page, limit } }
        }
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

    async getListRank(body: any): Promise<ResponseServiceInterface<any>> {
        let { page, limit } = Helper.transformQueryList(body)
        let { sort } = body
        let sub_query = this.repository
            .createQueryBuilder("eh_sub")
            .select(['eh_sub.user_id', 'e_sub.topic_id', 'MAX(eh_sub.score) as max_score'])
            .leftJoin("eh_sub.exam", "e_sub")
            .where('eh_sub.end_time IS NOT NULL')
            .groupBy('eh_sub.user_id, e_sub.topic_id');

        let query_builder = this.repository
            .createQueryBuilder("eh")
            .select([
                'eh.user_id as user_id',
                'eh.score as exam_score',
                't.title as topic_title',
                'u.name as user_name',
                'u.email as user_email',
                "eh.start_time as exam_start_time",
                "eh.end_time as exam_end_time",
                "TIMEDIFF(eh.end_time, eh.start_time) as time_diff"
            ])
            .leftJoin("eh.exam", "e")
            .leftJoin("e.topic", "t")
            .leftJoin("eh.user", "u")
            .where((qb: SelectQueryBuilder<any>) => {
                qb.where(`(eh.user_id, e.topic_id, eh.score) IN (${sub_query.getQuery()})`);
                qb.setParameter('sub_query', sub_query.getParameters());
            })
            .andWhere('eh.end_time IS NOT NULL')
            .limit(limit)
            .offset((page - 1) * limit)

        if (sort && Object.keys(sort).length > 0 && ["exam_score", "time_diff"].includes(Object.keys(sort)[0])) {
            let key = Object.keys(sort)[0]
            query_builder.orderBy(key, ["DESC", "ASC"].includes(sort[key]) ? sort[key] : "DESC")
        } else {
            query_builder.orderBy("exam_score", "DESC")
        }
        let [list, total] = await Promise.all([
            query_builder.getRawMany(),
            query_builder.getCount()
        ])
        return { error: null, data: { list, total, page, limit, } }
    }


    async getAllListHistoryForUser(user_decode: PayloadTokenInterface, body: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
        let { page, limit } = Helper.transformQueryList(body)
        let { filter, sort } = body
        let exams = await this.examRepository.find({
            where: {
                user_id: user_decode.id,
                type: ExamType.auto,
                topic_id: Not(IsNull())
            },
            order: {
                id: "DESC"
            },
            select: ["id"]
        })
        let exam_ids = exams.map(i => i.id)
        if(exam_ids.length == 0) {
            return  { error: null, data: { list: [], total: 0, page, limit } }
        }
        let query_builder = this.repository.createQueryBuilder("eh")
            .leftJoin("eh.exam", "e")
            .addSelect("e.topic_id")
            .leftJoin("e.topic", "t")
            .addSelect(["t.id","t.title"])
            .leftJoin("t.slug", "s")
            .addSelect("s.slug")
            .where("eh.exam_id IN (:...exam_ids)", { exam_ids: exam_ids })
            .andWhere("eh.user_id = :user_id", { user_id: user_decode.id })
            
        if(filter?.topic_slugs && Array.isArray(filter.topic_slugs)) {
            query_builder.andWhere("s.slug IN (:...slugs)", { slugs: filter.topic_slugs })
        }   
        if(filter?.topic_ids && Array.isArray(filter.topic_ids)) {
            query_builder.andWhere("t.id IN (:...ids)", { ids: filter.topic_ids })
        }
          
        if (sort && Object.keys(sort).length > 0 && ["score", "created_at"].includes(Object.keys(sort)[0])) {
            let key = Object.keys(sort)[0]
            query_builder.orderBy(`eh.${key}`, ["DESC", "ASC"].includes(sort[key]) ? sort[key] : "DESC")
        } else {
            query_builder.orderBy("eh.created_at", "DESC")
        }

        let [list, total] = await query_builder.getManyAndCount()
        list = list.map(item => {
            return {
                ...item,
                total_minute_work: Helper.calculateTimeWorkExam(item.start_time, item.end_time)
            }
        })
        return { error: null, data: { list, total, page, limit } }
    }
    
}
