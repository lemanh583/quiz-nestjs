import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { ResponseServiceInterface } from 'src/common/interface';
import { User } from 'src/user/user.entity';
import { Package } from 'src/package/package.entity';
import { MessageError } from 'src/common/enum/error.enum';
import { Category } from 'src/category/category.entity';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { Topic } from 'src/topic/topic.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private readonly repository: Repository<Transaction>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Package)
        private readonly packageRepository: Repository<Package>,
        @InjectRepository(Topic)
        private readonly topicRepository: Repository<Topic>,
    ) { }

    async findOne(condition: FindOneOptions<Transaction>): Promise<Transaction> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Transaction>, data: Partial<Transaction>, options?: Omit<FindOneOptions<Transaction>, 'where'>): Promise<Transaction> {
        await this.repository.update(condition, data)
        return this.repository.findOne({ where: condition, ...options })
    }

    async save(data: Partial<Transaction>): Promise<Transaction> {
        const entity = Object.assign(new Transaction(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Transaction>): Promise<Transaction[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Transaction>): Promise<[Transaction[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Transaction>): Promise<number> {
        return this.repository.count(condition)
    }

    async createTransaction(body: CreateTransactionDto): Promise<ResponseServiceInterface<any>> {
        let { user_id, price = 0, topic_ids, package_id } = body
        let [user, package_db] = await Promise.all([
            this.userRepository.findOne({ where: { id: user_id } }),
            this.packageRepository.findOne({ where: { id: package_id } }),
        ])
        if (!user || !package_db) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        await Promise.all([
            topic_ids.map(async (topic_id: number) => {
                let topic = await this.topicRepository.findOne({ where: { id: topic_id } })
                if (!topic) return
                await this.save({
                    price,
                    package: package_db,
                    user,
                    topic
                })
            })
        ])
        return { error: null, data: { message: "Done!" } }
    }

    async getListTransaction(payload: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
        let { limit = 10, page = 1 } = payload
        let condition = this.handleFilter(payload, page, limit)
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
        let condition: FindManyOptions<Transaction> = {
            select: {
                user: {
                    id: true,
                    email: true,
                },
                topic: {
                    id: true,
                    title: true
                },
                package: {
                    id: true,
                    title: true
                }
            },
            order: payload.sort,
            take: limit,
            skip: (page - 1) * limit,
            relations: {
                user: true,
                topic: true,
                package: true
            }
        }
        let where: FindOptionsWhere<Transaction> = {};
        if (payload.search) {
            where.user = {
                email: payload.search
            }
        }
        if (payload?.filter?.topic_ids) {
            where.topic = {
                id: In(payload.filter.topic_ids)
            }
        }
        if (Object.keys(where).length > 0) {
            condition.where = where
        }
        return condition
    }

    async updateTransaction(transaction_id: number, body: UpdateTransactionDto): Promise<ResponseServiceInterface<any>> {
        let { user_id, package_id, price, category_id } = body
        let transaction = await this.findOne({ where: { id: transaction_id } })
        if (!transaction) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        if (user_id) {
            let user = await this.userRepository.findOne({ where: { id: user_id }})
            if (user) {
                transaction.user = user
            }
        }
        if (category_id) {
            let category = await this.topicRepository.findOne({ where: { id: category_id }})
            if(category) {
                transaction.topic = category
            }
        }
        if (price != undefined && price >= 0) { 
            transaction.price = price
        }
        if (package_id) {
            let package_db = await this.packageRepository.findOne({ where: { id: package_id }})
            if(!package_db) {
                return { error: MessageError.ERROR_NOT_FOUND, data: null }
            }
            transaction.package = package_db
        }
        await this.save(transaction)
        return { error: null, data: transaction }
    }

    async deleteTransaction(id: number): Promise<ResponseServiceInterface<any>> {
        let transaction = await this.findOne({ where: { id } })
        if (!transaction) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        await this.repository.delete({ id })
        return { error: null, data: { message: "Done!" } }
    }

}
