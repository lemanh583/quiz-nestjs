import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './exam.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import * as ExcelJS from "exceljs"

@Injectable()
export class ExamService {
    constructor(@InjectRepository(Exam) private readonly repository: Repository<Exam>) { }

    async findOne(condition: FindOneOptions<Exam>): Promise<Exam> {
        return this.repository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<Exam>, data: Exam): Promise<Exam> {
        let record = await this.repository.findOneBy(condition)
        let updateRecord = Object.assign(record, data)
        return this.repository.save(updateRecord);
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

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            data.push(row.values);
        });
        return data
    }

}
