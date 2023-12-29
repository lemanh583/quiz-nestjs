import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Like, Repository, In } from 'typeorm';
import { Helper } from 'src/common/helper';
import { ResponseServiceInterface } from 'src/common/interface';
import { CategoryDto, CreateCategoryDbDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import { MessageError } from 'src/common/enum/error.enum';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { Slug } from 'src/slug/slug.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repository: Repository<Category>,
    @InjectRepository(Slug) private readonly slugRepository: Repository<Slug>,
  ) { }

  async findOne(condition: FindOneOptions<Category>): Promise<Category> {
    return this.repository.findOne(condition)
  }

  async updateOne(condition: FindOptionsWhere<Category>, data: Partial<Category>): Promise<Category> {
    await this.repository.update(condition, data)
    return this.repository.findOne({ where: condition })
  }

  async save(data: Partial<Category>): Promise<Category> {
    const entity = Object.assign(new Category(), data);
    return this.repository.save(entity);
  }

  async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Category>): Promise<Category[]> {
    skip = (!!skip && skip) || 0
    take = (!!take && take) || 10
    return this.repository.find({
      where,
      order,
      skip,
      take,
      ...args
    })
  }

  async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Category>): Promise<[Category[], number]> {
    skip = (!!skip && skip) || 0
    take = (!!take && take) || 10
    return this.repository.findAndCount({
      where,
      order,
      skip,
      take,
      ...args
    })
  }

  async count(condition: FindManyOptions<Category>): Promise<number> {
    return this.repository.count(condition)
  }

  async createCategory(data: CreateCategoryDto): Promise<ResponseServiceInterface<CategoryDto>> {
    let { title, lang_type } = data
    let slug = Helper.removeAccents(title, true)
    let check = await this.count({ where: { slug } })
    if (!!check) {
      return { error: MessageError.ERROR_EXISTS, data: null }
    }
    let new_category = await this.save({ title, lang_type, slug })
    return {
      error: null,
      data: CategoryDto.plainToClass(new_category as any)
    }
  }

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<ResponseServiceInterface<CategoryDto>> {
    let { title, lang_type, hidden } = data
    let category = await this.findOne({ where: { id } })
    if (!category) {
      return { error: MessageError.ERROR_NOT_FOUND, data: null }
    }
    let withTime = false
    let new_slug = Helper.removeAccents(title, withTime)
    let old_slug = Helper.removeAccents(category.title, withTime)
    if (new_slug != old_slug) {
      new_slug = Helper.removeAccents(title, true)
      let count = await this.count({ where: { slug: new_slug }})
      if (!!count) {
        return { error: MessageError.ERROR_EXISTS, data: null }
      }
      category.title = title
      category.slug = new_slug
    }
    if(lang_type) category.lang_type = lang_type
    if(hidden != undefined) category.hidden = hidden
    await this.updateOne({ id: category.id }, category)
    return {
      error: null,
      data: CategoryDto.plainToClass(category as any)
    }
  }

  async getListCategory(filter: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
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
    let condition: FindManyOptions<Category> = {
      select: {
        // hidden: false
      },
      order: payload.sort,
      take: limit,
      skip: (page - 1) * limit
    }
    let where: FindOptionsWhere<Category> = {};
    if (payload.search) {
      let search = Helper.removeAccents(payload.search, false)
      where.slug = Like(`%${search}%`)
    }
    if(payload.filter.topic_ids) {
      where.topics  = {
        id: In(payload.filter.topic_ids)
      }
    }
    if (Object.keys(where).length > 0) {
      condition.where = where
    }
    return condition
  }
}
