import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Like, Not, Repository, FindOptionsRelations } from 'typeorm';
import { SlugService } from 'src/slug/slug.service';
import { SlugType } from 'src/common/enum/slug.enum';
import { Helper } from 'src/common/helper';
import { ResponseServiceInterface } from 'src/common/interface';
import { CategoryDto, CreateCategoryDbDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import { MessageError } from 'src/common/enum/error.enum';
import { BaseListFilterDto, TestParam, defaultParamList } from 'src/common/base/base.list';
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

  async save(data: CreateCategoryDbDto): Promise<Category> {
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
    let { title, type, lang_type } = data
    let withTime = false
    let slug = Helper.removeAccents(data.title, withTime)
    let check = await this.slugRepository.count({ where: { slug } })
    if (!!check) {
      return { error: MessageError.ERROR_EXISTS, data: null }
    }
    let newSlug = await this.slugRepository.save(
      Object.assign(new Slug(), { slug, type: SlugType.category })
    )
    let newCategory = await this.save({ title, type, slug: newSlug, lang_type })
    return {
      error: null,
      data: CategoryDto.plainToClass(newCategory as any)
    }
  }

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<ResponseServiceInterface<CategoryDto>> {
    let { title, type, lang_type, hidden } = data
    let category = await this.findOne({ where: { id }, relations: ["slug"] })
    if (!category) {
      return { error: MessageError.ERROR_NOT_FOUND, data: null }
    }
    let withTime = false
    let slug = Helper.removeAccents(title, withTime)
    if (title) {
      let checkSlug = await this.slugRepository.findOne({ where: { slug, id: Not(category.slug_id) } })
      if (!!checkSlug) {
        return { error: MessageError.ERROR_EXISTS, data: null }
      }
      if (slug != category.slug.slug) {
        let updateSlug = await this.slugRepository.save({ id: category.slug_id, slug })
        category.title = title
        category.slug = updateSlug
      }
    }
    if (type) category.type = type
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
    let where: FindOptionsWhere<Category> = {};
    if (payload.search) {
      let search = Helper.removeAccents(payload.search, false)
      where.slug = {
        slug: Like(`%${search}%`)
      }
    }
    if (Object.keys(where).length > 0) {
      condition.where = where
    }
    return condition
  }
}
