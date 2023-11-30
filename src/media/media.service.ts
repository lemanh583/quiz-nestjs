import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Media } from './media.entity';
@Injectable()
export class MediaService {
    constructor(@InjectRepository(Media) private readonly repository: Repository<Media>){}
    
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
            where: { deleted_at: null, ...where },
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Media>): Promise<[Media[], number]> {
        return this.repository.findAndCount({
            where: { deleted_at: null, ...where },
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Media>): Promise<number> {
        return this.repository.count(condition)
    }

}
