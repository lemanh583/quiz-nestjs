import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In, Like, Not, Repository } from 'typeorm';
import { PayloadTokenInterface, ResponseServiceInterface } from 'src/common/interface';
import { MessageError } from 'src/common/enum/error.enum';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { CreateTopicDto, UpdateTopicDto } from './dto';
import { Helper } from 'src/common/helper';
import { Slug } from 'src/slug/slug.entity';
import { SlugType } from 'src/common/enum/slug.enum';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { Transaction } from 'src/transaction/transaction.entity';
import { Exam } from 'src/exam/exam.entity';
import { ExamType } from 'src/common/enum/exam.enum';
import { UserRole } from 'src/common/enum/user.enum';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic) private readonly repository: Repository<Topic>,
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(Exam) private readonly examRepository: Repository<Exam>,
        @InjectRepository(ExamHistory) private readonly examHistoryRepository: Repository<ExamHistory>,
        @InjectRepository(Slug) private readonly slugRepository: Repository<Slug>,
    ) { }

    async findOne(condition: FindOneOptions<Topic>): Promise<Topic> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Topic>, data: Partial<Topic>): Promise<Topic> {
        let record = await this.repository.findOneBy(condition)
        let updateRecord = Object.assign(record, data)
        return this.repository.save(updateRecord);
    }

    async save(data: any): Promise<Topic> {
        const entity = Object.assign(new Topic(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Topic>): Promise<Topic[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Topic>): Promise<[Topic[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Topic>): Promise<number> {
        return this.repository.count(condition)
    }

    async isAccessTopic(topic: Topic, user_decode: PayloadTokenInterface): Promise<{ is_access_topic: boolean, is_free: boolean }> {
        if (!user_decode || !topic.id) {
            return { is_access_topic: false, is_free: true }
        }
        if (user_decode.role == UserRole.ADMIN) {
            return { is_access_topic: true, is_free: false }
        }
        let transaction = await this.transactionRepository.count({
            where: {
                topic_id: topic.id,
                user_id: user_decode.id
            }
        })
        if (transaction > 0) {
            return { is_access_topic: true, is_free: false }
        }
        // let count_history: number = await this.examHistoryRepository.count({
        //     where: {
        //         user_id: user_decode.id,
        //         exam: {
        //             topic_id: topic.id
        //         }
        //     }
        // })
        // if (count_history > 0) {
        //     return { is_access_topic: false, is_free: false }
        // }
        return { is_access_topic: true, is_free: true }
    }

    async createTopic(data: CreateTopicDto): Promise<ResponseServiceInterface<any>> {
        let { title, type, lang_type } = data
        let withTime = false
        let slug = Helper.removeAccents(data.title, withTime)
        let check = await this.slugRepository.count({ where: { slug } })
        if (!!check) {
            return { error: MessageError.ERROR_EXISTS, data: null }
        }
        let new_slug = await this.slugRepository.save(
            Object.assign(new Slug(), { slug, type: SlugType.topic })
        )
        let topic = await this.save({ title, type, slug: new_slug, lang_type })
        return {
            error: null,
            data: topic
        }
    }

    async updateTopic(id: number, data: UpdateTopicDto): Promise<ResponseServiceInterface<any>> {
        let { title, type, lang_type, hidden, img } = data
        let topic = await this.findOne({ where: { id }, relations: ["slug"] })
        if (!topic) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let withTime = false
        if (title) {
            let slug = Helper.removeAccents(title, withTime)
            let checkSlug = await this.slugRepository.findOne({ where: { slug, id: Not(topic.slug_id) } })
            if (!!checkSlug) {
                return { error: MessageError.ERROR_EXISTS, data: null }
            }
            if (title != topic.title) {
                let updateSlug = await this.slugRepository.save({ id: topic.slug_id, slug })
                topic.title = title
                topic.slug = updateSlug
            }
        }
        if (type) topic.type = type
        if (lang_type) topic.lang_type = lang_type
        if (hidden != undefined) topic.hidden = hidden
        if (img) topic.img = img
        await this.updateOne({ id: topic.id }, topic)
        return {
            error: null,
            data: topic
        }
    }

    async getListTopic(filter: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
        let { limit = 10, page = 1 } = filter
        let condition = this.handleFilter(filter, page, limit)
        let [list, total] = await this.findAndCount(condition)
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

    handleFilter(payload: BaseListFilterDto<any, any>, page: number, limit: number): FindManyOptions {
        let condition: FindManyOptions<Topic> = {
            select: {
                slug: {
                    id: true,
                    slug: true,
                    type: true
                },
                hidden: false
            },
            order: payload.sort,
            take: limit,
            skip: (page - 1) * limit,
            relations: {
                slug: true
            }
        }
        let where: FindOptionsWhere<Topic> = {};
        if (payload.search) {
            let search = Helper.removeAccents(payload.search, false)
            where.slug = {
                slug: Like(`%${search}%`)
            }
        }
        if (payload?.filter?.types) {
            where.type = In(payload.filter?.types)
        }
        if (payload?.filter?.lang_type) {
            where.lang_type = payload.filter?.lang_type
        }
        if (Object.keys(where).length > 0) {
            condition.where = where
        }
        return condition
    }
}

