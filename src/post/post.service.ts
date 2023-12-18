import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { Post } from './post.entity';
import { ResponseServiceInterface } from 'src/common/interface';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Category } from 'src/category/category.entity';
import { Slug } from 'src/slug/slug.entity';
import { Helper } from 'src/common/helper';
import { MessageError } from 'src/common/enum/error.enum';
import { SlugType } from 'src/common/enum/slug.enum';
import { BaseListFilterDto } from 'src/common/base/base.list';
@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly repository: Repository<Post>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Slug)
        private readonly slugRepository: Repository<Slug>
    ) { }

    async findOne(condition: FindOneOptions<Post>): Promise<Post> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Post>, data: Partial<Post>): Promise<Post> {
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

    async getPost(slug: string): Promise<ResponseServiceInterface<any>> {
        let post = await this.findOne({
            where: { slug: { slug } },
            relations: { category: true, slug: true }
        })
        if (!post) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        return { error: null, data: post }
    }

    async createPost(body: CreatePostDto): Promise<ResponseServiceInterface<any>> {
        let { title, descriptions, category_id, content } = body;
        let slug = Helper.removeAccents(title, true)
        let check_slug = await this.slugRepository.count({ where: { slug } })
        if (check_slug) {
            return { error: MessageError.ERROR_EXISTS, data: null }
        }
        let slug_db = await this.slugRepository.save({ slug, type: SlugType.post })
        let category = await this.categoryRepository.findOne({ where: { id: category_id } })
        if (!category) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let post = await this.save({
            title,
            slug: slug_db,
            descriptions,
            content,
            category
        })
        return { error: null, data: post }
    }

    async updatePost(post_id: number, body: UpdatePostDto): Promise<ResponseServiceInterface<any>> {
        let { title, descriptions, content, category_id, position } = body
        let post = await this.findOne({ where: { id: post_id } })
        if (!post) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let post_update: Partial<Post> = {}
        if (title && post.title != title) {
            let slug_update = Helper.removeAccents(title, true)
            let checkSlug = await this.slugRepository.count({ where: { slug: slug_update } })
            if (!!checkSlug) {
                return { error: MessageError.ERROR_EXISTS, data: null }
            }
            post_update.slug = await this.slugRepository.save({ id: post.slug_id, slug: slug_update })
            post_update.title = title
        }
        if (category_id && post.category_id != category_id) {
            let category = await this.categoryRepository.findOne({ where: { id: category_id } })
            if (!category) {
                return { error: MessageError.ERROR_NOT_FOUND, data: null }
            }
            post_update.category = category
        }

        if (descriptions) post_update.descriptions = descriptions
        if (content) post_update.content = content
        if (position) post_update.position = position
        let update = await this.updateOne({ id: post.id }, post_update)
        return { error: null, data: update }
    }

    async deletePost(post_id: number): Promise<ResponseServiceInterface<any>> {
        let post = await this.findOne({ where: { id: post_id } })
        if (!post) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        await this.repository.delete({ id: post.id })
        return { error: null, data: { message: "Done!" } }
    }

    async listPost(payload: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
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
        let condition: FindManyOptions<Post> = {
            select: {
                slug: {
                    id: true,
                    slug: true,
                    type: true
                },
                category: {
                    id: true,
                    title: true,
                    type: true
                }
            },
            order: payload.sort || { created_at: "DESC" },
            take: limit,
            skip: (page - 1) * limit,
            relations: {
                slug: true,
                category: true
            }
        }
        let where: FindOptionsWhere<Post> = {};
        if (payload.search) {
            let search = Helper.removeAccents(payload.search, false)
            where.slug = {
                slug: Like(`%${search}%`)
            }
        }
        if (Array.isArray(payload?.filter?.category_ids)) {
            where.category = {
                id: In(payload.filter.category_ids)
            }
        }
        if (Array.isArray(payload?.filter?.positions)) {
            where.position = In(payload?.filter?.positions)
        }
        if (Object.keys(where).length > 0) {
            condition.where = where
        }
        return condition
    }
}
