import { Injectable } from '@nestjs/common';
import { Tag } from './tag.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseServiceInterface } from 'src/common/interface';
import { CreateTagDto, UpdateTagDto } from './dto';
import { Helper } from 'src/common/helper';
import { MessageError } from 'src/common/enum/error.enum';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly repository: Repository<Tag>,
    ) { }

    async findOne(condition: FindOneOptions<Tag>): Promise<Tag> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Tag>, data: Partial<Tag>): Promise<Tag> {
        let record = await this.repository.findOneBy(condition)
        let updateRecord = Object.assign(record, data)
        return this.repository.save(updateRecord);
    }

    async save(data: any): Promise<Tag> {
        const entity = Object.assign(new Tag(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Tag>): Promise<Tag[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Tag>): Promise<[Tag[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Tag>): Promise<number> {
        return this.repository.count(condition)
    }

    async createTag(body: CreateTagDto): Promise<ResponseServiceInterface<any>> {
        let { title } = body
        let slug = Helper.removeAccents(title, false)
        let tag = await this.findOne({ where: { slug } })
        if (tag) {
            return { error: MessageError.ERROR_EXISTS, data: null }
        }
        let new_tag = await this.save({ title, slug })
        return { error: null, data: new_tag }
    }

    async updateTag(id: number, body: UpdateTagDto): Promise<ResponseServiceInterface<any>> {
        let { title } = body
        let tag = await this.findOne({ where: { id } })
        if (!tag) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        if (!title) {
            return { error: null, data: tag }
        }
        let slug = Helper.removeAccents(title, false)
        if (tag.slug == slug) {
            return { error: null, data: tag }
        }
        let count = await this.count({ where: { slug } })
        if (!!count) {
            return { error: MessageError.ERROR_EXISTS, data: null }
        }
        tag.title = title
        tag.slug = slug
        let update_tag = await this.save(tag)
        return { error: null, data: update_tag }
    }

    async deleteTag(id: number): Promise<ResponseServiceInterface<any>> {
        let tag = await this.findOne({ where: { id } })
        if (!tag) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        await this.repository.delete({ id })
        return { error: null, data: { message: "Done!" } }
    }

    async listTag(query: any): Promise<ResponseServiceInterface<any>> {
        let { page, limit } = Helper.transformQueryList(query);
        let [list, total] = await this.repository.findAndCount({ take: limit, skip: (page - 1) * limit })
        return { error: null, data: { list, total, page, limit } }
    }

}
