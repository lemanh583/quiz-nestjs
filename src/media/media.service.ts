import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { Media } from './media.entity';
import { ResponseServiceInterface } from 'src/common/interface';
import { CreateMediaDto } from './dto';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { MessageError } from 'src/common/enum/error.enum';
import * as fs from 'fs';
@Injectable()
export class MediaService {
    constructor(@InjectRepository(Media) private readonly repository: Repository<Media>) { }

    async findOne(condition: FindOneOptions<Media>): Promise<Media> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Media>, data: Media): Promise<Media> {
        let record = await this.repository.findOneBy(condition)
        let updateRecord = Object.assign(record, data)
        return this.repository.save(updateRecord);
    }

    async save(data: any): Promise<Media> {
        const entity = Object.assign(new Media(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Media>): Promise<Media[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Media>): Promise<[Media[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Media>): Promise<number> {
        return this.repository.count(condition)
    }

    async saveMultipleMedia(files: Array<Express.Multer.File>, body: CreateMediaDto): Promise<ResponseServiceInterface<any>> {
        let { ref_type, ref_id } = body
        let records = files.map(file => {
            let record = new Media()
            record.size = file.size
            record.src = process.env.SERVER_NAME + '/static/' + file.filename
            record.type = file.mimetype
            record.name = file.filename
            record.ref_type = ref_type
            record.ref_id = ref_id
            record.local_path = file.path
            return Object.assign(new Media(), record)
        })
        await this.repository.insert(records)
        return { error: null, data: { message: 'done!' } }
    }

    async listMedia(payload: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
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
        let condition: FindManyOptions<Media> = {
            order: payload.sort || { created_at: "DESC" },
            take: limit,
            skip: (page - 1) * limit,
        }
        let where: FindOptionsWhere<Media> = {};
        if (payload?.filter?.types) {
            where.type = In(payload.filter.types)
        }
        if (payload?.filter?.ref_types) {
            where.ref_type = In(payload.filter.ref_types)
        }
        if (Object.keys(where).length > 0) {
            condition.where = where
        }
        return condition
    }

    async deleteMedia(media_id: number): Promise<ResponseServiceInterface<any>> {
        let media = await this.findOne({ where: { id: media_id } })
        if (!media) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        await this.repository.delete({ id: media.id })
        fs.unlinkSync(media.local_path)
        return { error: null, data: { message: "Done!" } }
    }

}
