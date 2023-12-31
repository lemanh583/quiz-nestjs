import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Like, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { UpdatePasswordDto, UpdateUserDto } from './dto';
import { PayloadTokenInterface, ResponseServiceInterface } from 'src/common/interface';
import { MessageError } from 'src/common/enum/error.enum';
import * as argon2 from "argon2"
import { Transaction } from 'src/transaction/transaction.entity';
import { Helper } from 'src/common/helper';
import { BaseListFilterDto } from 'src/common/base/base.list';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>
    ) { }

    async findOne(condition: FindOneOptions<User>): Promise<User> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<User>, data: Partial<User>, options?: Omit<FindOneOptions<User>, 'where'>): Promise<User> {
        await this.repository.update(condition, data)
        return this.repository.findOne({ where: condition, ...options })
    }

    async save(data: any): Promise<User> {
        const entity = Object.assign(new User(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<User>): Promise<User[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<User>): Promise<[User[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<User>): Promise<number> {
        return this.repository.count(condition)
    }

    async updateProfile(id: number, data: UpdateUserDto): Promise<ResponseServiceInterface<string>> {
        let user = await this.findOne({ where: { id } })
        if (!user) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null };
        }
        if (data.email) {
            let email = await this.findOne({ where: { email: data.email, id: Not(user.id) } })
            if (email) {
                return { error: MessageError.ERROR_EXISTS, data: null }
            }
        }
        await this.updateOne({ id }, data as User)
        return { error: null, data: "Done!" }
    }

    async changePassword(id: number, data: UpdatePasswordDto): Promise<ResponseServiceInterface<any>> {
        let { new_password, old_password } = data
        let user = await this.findOne({ where: { id } })
        if (!user) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null };
        }
        let verify = await argon2.verify(user.password, old_password)
        if (!verify) {
            return { error: MessageError.ERROR_INVALID_PASSWORD, data: null };
        }
        let hash = await argon2.hash(new_password,)
        await this.updateOne({ id }, { password: hash } as User)
        return { error: null, data: "Done!" };
    }

    async detailUser(user_decode: PayloadTokenInterface): Promise<ResponseServiceInterface<any>> {
        let user = await this.findOne({
            where: {
                id: user_decode.id,
                transactions: {
                    user_id: user_decode.id,
                }
            },
            relations: {
                transactions: {
                    topic: true
                }
            }
        })
        if (!user) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        return { error: null, data: user }
    }

    async listTransactionForUser(user_id: number, query: any): Promise<ResponseServiceInterface<any>> {
        let { page = 1, limit = 10 } = Helper.transformQueryList(query);
        let user = await this.findOne({ where: { id: user_id } })
        if (!user) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let [list, total] = await this.transactionRepository.findAndCount({
            where: { user_id: user.id },
            relations: {
                topic: true
            }
        })
        return { error: null, data: { list, total, page, limit } }
    }

    async listUser(payload: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
        let { limit = 10, page = 1 } = payload
        let query = this.repository
            .createQueryBuilder("u")
            .loadRelationCountAndMap("u.total_transaction", "u.transactions")
            .select(["u.id", "u.email", "u.name", "u.ban", "u.created_at", "u.updated_at"])
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

    handleFilter(query: SelectQueryBuilder<User>, payload: BaseListFilterDto<any, any>, page: number, limit: number): any {
        if (payload.search) {
            query.andWhere("u.email LIKE :search", { search: `%${payload.search}%` })
        }
        if (Object.keys(payload?.sort || {}).length > 0) {
            Object.keys(payload?.sort).forEach(key => {
                query.addOrderBy(`u.${key}`, payload?.sort[key]);
            })
        } else {
            query.orderBy("u.created_at", "DESC")
        }
        query.skip((page - 1) * limit)
        query.take(limit)
    }
}
