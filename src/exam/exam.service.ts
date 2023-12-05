import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './exam.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
import * as ExcelJS from "exceljs"
import { CreateExamDto, FilterDto, UpdateExamDto } from './dto';
import { ResponseServiceInterface } from 'src/common/interface';
import { Helper } from 'src/common/helper';
import { SlugService } from 'src/slug/slug.service';
import { MessageError } from 'src/common/enum/error.enum';
import { SlugType } from 'src/common/enum/slug.enum';
import { CategoryService } from 'src/category/category.service';
import { BaseListFilterDto } from 'src/common/base/base.list';

@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam) private readonly repository: Repository<Exam>,
        private readonly slugService: SlugService,
        private readonly categoryService: CategoryService
    ) { }

    async findOne(condition: FindOneOptions<Exam>): Promise<Exam> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Exam>, data: Partial<Exam>, options?: Omit<FindOneOptions<Exam>, 'where'>): Promise<Exam> {
        await this.repository.update(condition, data)
        return this.repository.findOne({ where: condition, ...options })
    }

    async save(data: any): Promise<Exam> {
        const entity = Object.assign(new Exam(), data);
        return this.repository.save(entity);
    }

    async find({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Exam>): Promise<Exam[]> {
        return this.repository.find({
            where: { deleted_at: null, ...where },
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Exam>): Promise<[Exam[], number]> {
        return this.repository.findAndCount({
            where: { deleted_at: null, ...where },
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Exam>): Promise<number> {
        return this.repository.count(condition)
    }

    async handleUploadExcel(file: Express.Multer.File) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file.path);

        const worksheet = workbook.getWorksheet(1);
        const data: any[] = [];
        console.log(workbook.worksheets.length)

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            data.push(row.values);
        });
        return data
    }

    async createExam(data: CreateExamDto): Promise<ResponseServiceInterface<Partial<Exam>>> {
        let { title, category_id, time_end, time_start, total_generate_question, lang_type } = data
        let category = await this.categoryService.findOne({ where: { id: category_id } })
        if (!category) {
            return { error: MessageError.ERROR_NOT_FOUND + 'category', data: null }
        }
        let withTime = true
        let slug = Helper.removeAccents(title, withTime)
        let checkSlug = await this.slugService.count({ where: { slug } })
        if (!!checkSlug) {
            return { error: MessageError.ERROR_EXISTS, data: null }
        }
        let newSlug = await this.slugService.save({ slug, type: SlugType.exam })
        let dataCreate: Partial<Exam> = {
            title,
            category,
            slug: newSlug,
            total_generate_question,
            lang_type,
        }
        if (time_end && time_start) {
            dataCreate.time_start = time_start
            dataCreate.time_end = time_end
        }
        let newExam = await this.save(dataCreate)
        return {
            error: null,
            data: newExam
        }
    }

    async updateExam(id: number, data: UpdateExamDto): Promise<ResponseServiceInterface<Partial<Exam>>> {
        let { title, category_id, time_end, time_start, total_generate_question, lang_type } = data
        let exam = await this.findOne({ where: { id } })
        let examUpdate: Partial<Exam> = {}
        if (!exam) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        if (![undefined, exam.category_id].includes(category_id)) {
            let category = await this.categoryService.findOne({ where: { id: category_id } })
            if (!category) {
                return { error: MessageError.ERROR_NOT_FOUND + 'category', data: null }
            }
            examUpdate.category = category
        }
        if (title) {
            let slugUpdate = Helper.removeAccents(title, false)
            let slugDB = Helper.removeAccents(exam.title, false)
            if (slugUpdate != slugDB) {
                slugUpdate += "-" + Date.now()
                let checkSlug = await this.slugService.count({ where: { slug: slugUpdate } })
                console.log(checkSlug)
                if (!!checkSlug) {
                    return { error: MessageError.ERROR_EXISTS, data: null }
                }
                examUpdate.slug = await this.slugService.updateOne({ id: exam.slug_id }, { slug: slugUpdate })
                examUpdate.title = title
            }
        }
        if (time_end && time_start) {
            examUpdate.time_start = time_start
            examUpdate.time_end = time_end
        }
        examUpdate.lang_type = lang_type
        examUpdate.total_generate_question = total_generate_question
        let update = await this.updateOne({ id: exam.id }, examUpdate, { relations: ["slug", "category"] })
        return {
            error: null,
            data: update
        }
    }

    async getListExam(filter: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
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

    handleFilter(payload: BaseListFilterDto<FilterDto, any>, page: number, limit: number): FindManyOptions {
        let condition: FindManyOptions<Exam> = {
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
            order: payload.sort,
            take: limit,
            skip: (page - 1) * limit,
            relations: {
                slug: true,
                category: true
            }
        }
        let where: FindOptionsWhere<Partial<Exam>> = {};
        if (payload.search) {
            let search = Helper.removeAccents(payload.search, false)
            where.slug = {
                slug: Like(`%${search}%`)
            }
        }
        if (payload?.filter?.type) {
            where.type = payload.filter.type as any
        }
        if (payload?.filter?.category_id) {
            where.category_id = payload.filter?.category_id
        }
        if (payload?.filter?.lang_type) {
            where.lang_type = payload.filter.lang_type as any
        }
        if (Object.keys(where).length > 0) {
            condition.where = where
        }
        return condition
    }

}   
