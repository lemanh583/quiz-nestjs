import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Like, Not, Repository } from 'typeorm';
import { SlugService } from 'src/slug/slug.service';
import { SlugType } from 'src/common/enum/slug.enum';
import { Helper } from 'src/common/helper';
import { ResponseServiceInterface } from 'src/common/interface';
import { CategoryDto, CreateCategoryDbDto, CreateCategoryDto } from './dto';
import { MessageError } from 'src/common/enum/error.enum';
import { BaseListFilterDto, TestParam, defaultParamList } from 'src/common/base/base.list';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repository: Repository<Category>,
    private readonly slugService: SlugService
  ) { }

  async findOne(condition: FindOneOptions<Category>): Promise<Category> {
    return this.repository.findOne(condition)
  }

  async updateOne(condition: FindOptionsWhere<Category>, data: Category): Promise<Category> {
    let record = await this.repository.findOneBy(condition)
    let updateRecord = Object.assign(record, data)
    return this.repository.save(updateRecord);
  }

  async save(data: CreateCategoryDbDto): Promise<Category> {
    const entity = Object.assign(new Category(), data);
    return this.repository.save(entity);
  }

  async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Category>): Promise<Category[]> {
    skip = (!!skip && skip) || 0
    take = (!!take && take) || 10
    return this.repository.find({
      where: { deleted_at: null, ...where },
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
      where: { deleted_at: null, ...where },
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
    let { title, type } = data
    let withTime = false
    let slug = Helper.removeAccents(data.title, withTime)
    let check = await this.slugService.count({ where: { slug } })
    if (!!check) {
      return { error: MessageError.ERROR_EXISTS, data: null }
    }
    let createSlug = await this.slugService.save({ slug, type: SlugType.category })
    let createCategory = await this.save({ title, type, slug: createSlug })
    return {
      error: null,
      data: { ...createCategory, slug } as CategoryDto
    }
  }

  async getListCategory(filter: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
    let { limit = 0, page = 1 } = filter
    let condition = this.handleFilter(filter, page, limit)
    let [list, total] = await this.findAndCount(condition)
    return {
      error: null,
      data: {
        list,
        total,
        page,
        limit
      }
    }
  }

  handleFilter(payload: BaseListFilterDto<any, any>, page: number, limit: number): FindManyOptions {
    let condition: FindManyOptions<Category> = {
      order: payload.sort,
      take: limit,
      skip: (page - 1) * limit
    }
    let where: FindOptionsWhere<Category> = {};
    if (payload.search) {
      where.title = Like(`%${payload.search}%`)
    }
    if (Object.keys(where).length > 0) {
      condition.where = where
    }
    return condition
  }
}
