import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Post } from './post.entity';
@Injectable()
export class PostService {
    constructor(@InjectRepository(Post) private readonly repository: Repository<Post>){}
    
    async findOne(condition: FindOneOptions<Post>): Promise<Post> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Post>, data: Post): Promise<Post> {
        let record = await this.repository.findOneBy(condition)
        let updateRecord = Object.assign(record, data)
        return this.repository.save(updateRecord);
    }

    async save(data: any): Promise<Post> {
        const entity = Object.assign(new Post(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Post>): Promise<Post[]> {
        return this.repository.find({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Post>): Promise<[Post[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Post>): Promise<number> {
        return this.repository.count(condition)
    }
}
