import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exam } from './exam.entity';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, In, Like, QueryRunner, Repository, SelectQueryBuilder, getConnection } from 'typeorm';
import * as ExcelJS from "exceljs"
import { CategoriesElementAutoGenerate, CreateExamDto, ExamAutoGenerateDto, ExamEndDto, FilterExamDto, JSONImportDto, UpdateExamDto, UpdateLogExamDto } from './dto';
import { PayloadTokenInterface, ResponseServiceInterface } from 'src/common/interface';
import { Helper } from 'src/common/helper';
import { MessageError } from 'src/common/enum/error.enum';
import { SlugType } from 'src/common/enum/slug.enum';
import { BaseListFilterDto } from 'src/common/base/base.list';
import { UploadExamDto } from './dto/upload-exam.dto';
import { Question } from 'src/question/question.entity';
import { Answer } from 'src/answer/answer.entity';
import { ExamQuestion } from 'src/exam-question/exam-question.entity';
import { Slug } from 'src/slug/slug.entity';
import { ExamLangType, ExamType } from 'src/common/enum/exam.enum';
import * as fs from "fs"
import { v4 as uuidv4 } from 'uuid';
import { CATEGORY_DEFAULT_GENERATE_TEXT } from 'src/common/constants';
import { ExamHistory } from 'src/exam-history/exam-history.entity';
import { HistoryAnswer } from 'src/history-answer/history-answer.entity';
import { User } from 'src/user/user.entity';
import { Category } from 'src/category/category.entity';
import { CategoryExam } from 'src/category-exam/category-exam.entity';
import { Media } from 'src/media/media.entity';
import { MediaType } from 'src/common/enum/media.enum';
import { Topic } from 'src/topic/topic.entity';
import { TopicType } from 'src/common/enum/topic.enum';

@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam)
        private readonly repository: Repository<Exam>,
        @InjectRepository(ExamQuestion)
        private readonly examQuestionRepository: Repository<ExamQuestion>,
        @InjectRepository(ExamHistory)
        private readonly examHistoryRepository: Repository<ExamHistory>,
        @InjectRepository(HistoryAnswer)
        private readonly historyAnswerRepository: Repository<HistoryAnswer>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Slug)
        private readonly slugRepository: Repository<Slug>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(CategoryExam)
        private readonly categoryExamRepository: Repository<CategoryExam>,
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
        @InjectRepository(Topic)
        private readonly topicRepository: Repository<Topic>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
        private dataSource: DataSource
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
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async findAndCount({ where = {}, skip = 0, take = 10, order = { created_at: "DESC" }, ...args }: FindManyOptions<Exam>): Promise<[Exam[], number]> {
        return this.repository.findAndCount({
            where,
            order,
            skip,
            take,
            ...args
        })
    }

    async count(condition: FindManyOptions<Exam>): Promise<number> {
        return this.repository.count(condition)
    }

    async autoGenerateExam(user: PayloadTokenInterface, body: ExamAutoGenerateDto): Promise<ResponseServiceInterface<any>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let checkUser = await this.userRepository.count({ where: { id: user.id } })
            if (!checkUser) {
                return { error: MessageError.ERROR_NOT_FOUND, data: null }
            }
            let { categories, lang_type, total_question, topic_id, total_work } = body
            let total_questions = total_question ? total_question : 60
            let sum_percent: number = 0
            let total_question_from_percent: number = 0
            let new_categories: (CategoriesElementAutoGenerate & { take: number })[] = categories.map((category: CategoriesElementAutoGenerate) => {
                let take = Math.floor(total_questions * (category.percent / 100))
                sum_percent += category.percent
                total_question_from_percent += take
                return {
                    ...category,
                    take
                }
            })
            let missing_questions: number = total_questions - total_question_from_percent
            let count_fill_question_for_category: number = Math.floor(missing_questions / new_categories.length)
            let indexFillQuestion: number = 0
            let count = !count_fill_question_for_category ? 1 : count_fill_question_for_category
            while (missing_questions > 0) {
                new_categories[indexFillQuestion].take += count
                missing_questions -= count
                indexFillQuestion = indexFillQuestion == (new_categories.length - 1) ? 0 : indexFillQuestion + 1
            }

            let generateText = 'exam-' + uuidv4()
            // let slugDB = await queryRunner.manager.save(Slug, {
            //     slug: generateText,
            //     type: SlugType.exam,
            // })
            // let category = await this.categoryRepository.findOne({ where: { title: CATEGORY_DEFAULT_GENERATE_TEXT } })
            let newExam: Partial<Exam> = {
                title: generateText,
                // category,
                // slug: slugDB,
                // total_generate_question: totalQuestions,
                total_work,
                lang_type,
                user_id: user.id,
                type: ExamType.auto
            }
            if (topic_id) {
                let topic = await this.topicRepository.findOne({ where: { id: topic_id } })
                topic && (newExam.topic = topic)
            }
            let exam_DB = await queryRunner.manager.save(Exam, newExam)
            let random_questions: any = []
            // console.log('new_categories', new_categories)
            let failed_category_ids = []
            await Promise.all(
                new_categories.map(async (category) => {
                    let checkCategoryDB = await this.categoryRepository.findOne({ where: { id: category.category_id } })
                    if (!checkCategoryDB) {
                        throw new Error("Category id: " + category.category_id + " not found")
                    }
                    let get_exams = await this.repository
                        .createQueryBuilder("e")
                        .leftJoinAndSelect("e.category_exams", "ce")
                        .leftJoinAndSelect("ce.category", 'c')
                        .where("c.id = :category_id", { category_id: category.category_id })
                        .andWhere("e.type = :type", { type: ExamType.import })
                        .orderBy('RAND()')
                        .getMany()

                    if (get_exams.length == 0) {
                        failed_category_ids.push(category.category_id)
                        return
                    }
                    let exam_ids = get_exams.map((exam) => exam.id)
                    // console.log('exam_ids', exam_ids, category.category_id)
                    let get_random_question = await this.examQuestionRepository
                        .createQueryBuilder("e")
                        .where("e.exam_id IN (:...exam_ids)", { exam_ids: exam_ids })
                        .orderBy('RAND()')
                        .take(category.take)
                        .getMany()
                    // console.log('get_random_question', get_random_question.length)
                    await queryRunner.manager.save(CategoryExam, {
                        category: checkCategoryDB,
                        exam: exam_DB,
                        total: get_random_question.length
                    })
                    random_questions.push(...get_random_question)
                })
            )
            let data_insert: any = []
            random_questions = random_questions.map((q: any) => {
                data_insert.push({ question_id: q.question_id, exam_id: exam_DB.id })
                return q.question
            })
            data_insert = Helper.getRandomElements(data_insert, data_insert.length)
            await queryRunner.manager.insert(ExamQuestion, data_insert)
            await queryRunner.commitTransaction()
            return {
                error: null,
                data: {
                    exam: {
                        ...exam_DB,
                        total_question: data_insert.length
                    },
                    failed_category_ids,
                    message: "Done!"
                }
            }
        } catch (error) {
            console.log(error)
            await queryRunner.rollbackTransaction();
            return { error: error, data: null }
        } finally {
            await queryRunner.release()
        }

    }

    async handleUploadExcel(file: Express.Multer.File, body: UploadExamDto, user: PayloadTokenInterface): Promise<ResponseServiceInterface<any>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!file.path) {
                throw new Error("Upload failed");
            }
            let { topic_id, category_id, lang_type, type } = body

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(file.path);
            let promises = []

            // Nếu có topic_id thì là upload đề thi cho topic -> tạo mới category
            if (topic_id) {
                let topic = await this.topicRepository.findOne({
                    where: {
                        id: topic_id,
                        type: TopicType.exam
                    },
                    relations: {
                        categories: true
                    }
                })
                if (!topic) {
                    return { error: MessageError.ERROR_NOT_FOUND + 'category', data: null }
                }

                let category_data: Partial<Category> = {
                    title: file.originalname,
                    slug: Helper.removeAccents(file.originalname, true),
                    lang_type: lang_type
                }
                let category_db = await queryRunner.manager.save(Category, category_data)
                topic.categories.push(category_db)
                await queryRunner.manager.save(Topic, topic)
                let sheets = Array.from({ length: workbook.worksheets.length }, (_: any, i: number) => workbook.getWorksheet(i + 1))
                await Promise.all(
                    sheets.map(async (worksheet: ExcelJS.Worksheet, index: number) => {
                        let new_exam: Partial<Exam> = {
                            title: file.originalname + ' ' + index,
                            lang_type,
                            type: ExamType.import,
                            user_id: user.id
                        }
                        let examDB = await queryRunner.manager.save(Exam, new_exam)
                        await queryRunner.manager.save(CategoryExam, {
                            category: category_db,
                            exam: examDB,
                            total: worksheet.rowCount
                        })
                        worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
                            if (rowNumber == 1) return
                            promises.push(this.handleInsertQuestionAndAnswer(queryRunner, examDB, row, rowNumber))
                        });
                    })
                )
            } else {
                let worksheet = workbook.getWorksheet(1)
                let new_exam: Partial<Exam> = {
                    title: workbook.title,
                    lang_type,
                    type: ExamType.user,
                    user_id: user.id
                }
                let examDB = await queryRunner.manager.save(Exam, new_exam)
                worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
                    if (rowNumber == 1) return
                    promises.push(this.handleInsertQuestionAndAnswer(queryRunner, examDB, row, rowNumber))
                });
            }
            await Promise.all(promises)
            await queryRunner.commitTransaction();
            return { error: null, data: {} }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return { error: error, data: null }
        } finally {
            fs.unlinkSync(file.path)
            await queryRunner.release()
        }

    }

    async handleInsertQuestionAndAnswer(queryRunner: QueryRunner, exam: Exam, rows: ExcelJS.Row, rowNumber?: number): Promise<void> {
        if (rowNumber == 1) return
        let [_, questionIsr, aIsr, bIsr, cIsr, dIsr, answerIsr, recommendIsr]: any = rows.values
        let answers_obj = {
            'a': Helper.transformTextExcel(aIsr),
            'b': Helper.transformTextExcel(bIsr),
            'c': Helper.transformTextExcel(cIsr),
            'd': Helper.transformTextExcel(dIsr),
        }
        let string_answer = Helper.transformTextExcel(answerIsr).trim().toLowerCase().replaceAll("'", "")
        let correct_answer = string_answer[string_answer.length - 1]
        let question_DB = await queryRunner.manager.save(Question, {
            title: Helper.transformTextExcel(questionIsr),
            recommend: Helper.transformTextExcel(recommendIsr)
        })
        let answers_DB = []
        for (let key of Object.keys(answers_obj)) {
            let answer = await queryRunner.manager.save(Answer, {
                title: answers_obj[key],
                correct: answers_obj[correct_answer] && key == correct_answer ? true : false,
                question: question_DB
            })
            answers_DB.push(answer)
        }
        let check_all_true = answers_DB.every((anw: Answer) => anw.correct)
        let check_all_false = answers_DB.every((anw: Answer) => !anw.correct)
        if (check_all_true || check_all_false) {
            throw new Error(`Can detect correct answer for question: ` + question_DB.title)
        }
        await queryRunner.manager.save(ExamQuestion, {
            exam,
            question: question_DB
        })
    }

    async createExam(data: CreateExamDto, user: PayloadTokenInterface): Promise<ResponseServiceInterface<Partial<Exam>>> {
        let { title, category_id, time_end, time_start, lang_type } = data
        let category = await this.categoryRepository.findOne({ where: { id: category_id } })
        if (!category) {
            return { error: MessageError.ERROR_NOT_FOUND + 'category', data: null }
        }
        // let withTime = true
        // let slug = Helper.removeAccents(title, withTime)
        // let checkSlug = await this.slugRepository.count({ where: { slug } })
        // if (!!checkSlug) {
        //     return { error: MessageError.ERROR_EXISTS, data: null }
        // }
        // let newSlug = await this.slugRepository.save(Object.assign(new Slug(), { slug, type: SlugType.exam }))
        let dataCreate: Partial<Exam> = {
            title,
            // category,
            // slug: newSlug,
            // total_generate_question,
            lang_type,
            user_id: user.id
        }
        if (time_end && time_start) {
            dataCreate.time_start = time_start
            dataCreate.time_end = time_end
        }
        let newExam = await this.save(dataCreate)
        await this.categoryExamRepository.save({
            category: category,
            exam: newExam
        })
        return {
            error: null,
            data: newExam
        }
    }

    async updateExam(id: number, data: UpdateExamDto): Promise<ResponseServiceInterface<Partial<Exam>>> {
        let { title, category_ids, time_end, time_start, lang_type } = data
        let exam = await this.findOne({ where: { id }, relations: { category_exams: true } })
        let exam_update: Partial<Exam> = {}
        if (!exam) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        if (category_ids?.length) {
            let remove_exam_category_ids = exam.category_exams.filter((category_exam) => {
                if (!category_ids.includes(category_exam.category_id)) {
                    return category_exam
                }
            }).map(i => i.id)

            await Promise.all(
                category_ids.map(async (category_id: number) => {
                    let category = await this.categoryRepository.findOne({ where: { id: category_id } })
                    if (!category) {
                        throw new Error(MessageError.ERROR_NOT_FOUND + 'category')
                    }
                    let find = exam.category_exams.find((item) => item.category_id == category_id)
                    if (find) return
                    await this.categoryExamRepository.save({
                        category: category,
                        exam: exam
                    })
                })
            )
            this.categoryExamRepository.delete({ id: In(remove_exam_category_ids) })
        }
        if (title) {
            let slug_update = Helper.removeAccents(title, false)
            let slug_db = Helper.removeAccents(exam.title, false)
            if (slug_update != slug_db) {
                // slug_update += "-" + Date.now()
                // let checkSlug = await this.slugRepository.count({ where: { slug: slug_update } })
                // if (!!checkSlug) {
                //     return { error: MessageError.ERROR_EXISTS, data: null }
                // }
                // exam_update.slug = await this.slugRepository.save({ id: exam.slug_id, slug: slug_update })
                exam_update.title = title
            }
        }
        if (time_end && time_start) {
            exam_update.time_start = time_start
            exam_update.time_end = time_end
        }
        exam_update.lang_type = lang_type
        // exam_update.total_generate_question = total_generate_question
        let update = await this.updateOne({ id: exam.id }, exam_update, { relations: ["slug", "category_exams"] })
        return {
            error: null,
            data: update
        }
    }

    async getListExam(filter: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
        let { limit = 10, page = 1 } = filter
        let query = this.repository
            .createQueryBuilder("e")
            // .leftJoin("e.slug", "s")
            // .addSelect(["s.id", "s.slug", "s.type"])
            .leftJoinAndSelect("e.category_exams", "ce")
            // .leftJoinAndSelect("ce.category", "c")
            // .leftJoinAndSelect("c.topics", "t")
            .loadRelationCountAndMap("e.total_question", "e.exam_questions")

        this.handleFilter(query, filter, page, limit)
        let [list, total] = await query.getManyAndCount()
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

    handleFilter(query: SelectQueryBuilder<Exam>, payload: BaseListFilterDto<FilterExamDto, any>, page: number, limit: number): any {
        if (payload.search) {
            let search = Helper.removeAccents(payload.search, false)
            query.andWhere("s.title LIKE :search", { search: `%${search}%` })
        }
        if (payload?.filter?.type) {
            query.andWhere("e.type = :type", { type: payload.filter.type })
        }
        if (payload?.filter?.category_ids) {
            query.andWhere("ce.category_id IN (:...category_ids)", { category_ids: payload?.filter?.category_ids })
        }
        if (payload?.filter?.lang_type) {
            query.andWhere("e.lang_type = :lang_type", { lang_type: payload?.filter?.lang_type })
        }
        if (payload?.filter?.user_ids) {
            query.andWhere("e.user_id IN (:...user_ids)", { user_ids: payload?.filter?.user_ids })
        }
        if (payload?.filter?.topic_ids) {
            query.andWhere("e.topic_id IN (:...topic_ids)", { topic_ids: payload?.filter?.topic_ids })
        }
        if (Object.keys(payload?.sort || {}).length > 0) {
            Object.keys(payload?.sort).forEach(key => {
                query.addOrderBy(`e.${key}`, payload?.sort[key]);
            })
        } else {
            query.orderBy("e.created_at", "DESC")
        }
        query.take(limit)
        query.skip((page - 1) * limit)
        return query
    }

    async startExam(id: number, user: PayloadTokenInterface, query: any): Promise<ResponseServiceInterface<any>> {
        let { page = 1, limit = 60 } = query
        let exam = await this.findOne({ where: { id }, relations: { topic: true } })
        if (!exam || exam?.hidden) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let time_current = new Date()
        let time_current_mili = time_current.getTime()
        if (exam.time_end && exam.time_end < time_current) {
            return { error: MessageError.ERROR_EXPIRES_EXAM, data: null }
        }
        if (exam.time_start && exam.time_start > time_current) {
            return { error: MessageError.ERROR_EXPIRES_EXAM, data: null }
        }

        let history_build_query = this.examHistoryRepository
            .createQueryBuilder("ex")
            .innerJoinAndSelect("ex.history_answers", "ha")
            .where("ex.exam_id = :exam_id", { exam_id: exam.id })
            .andWhere("ex.user_id = :user_id", { user_id: user.id })
            .orderBy("ex.created_at", "DESC")

        let build_query = this.examQuestionRepository
            .createQueryBuilder("eq")
            .leftJoin("eq.question", "q")
            .addSelect(["q.id", "q.title", "q.type"])
            .leftJoin("q.answers", "a")
            .addSelect(["a.id", "a.title"])
            .where("eq.exam_id = :exam_id", { exam_id: exam.id })

        let latest_history = await history_build_query.getOne()
        // Điều kiện chưa có lịch sử or lịch sử làm bài kết thúc thi thì tạo mới lịch sử 
        // TH1: Nếu thời gian làm bài được set. Tính thời gian làm bài mới nhất + số phút làm so với time hiện tại quá hay chưa? 
        let time_condition = (exam.time_work_minutes && (latest_history?.start_time.getTime() + exam.time_work_minutes * 60 * 1000 < time_current_mili));
        let condition = !latest_history
            || (latest_history && latest_history.end_time)
            || time_condition;

        // condition && (build_query = build_query.orderBy('RAND()'))
        let questions_random = await build_query.getMany()

        let count_work = await this.examHistoryRepository.count({ where: { exam_id: exam.id, user_id: user.id } })
        if (((count_work >= exam.total_work) && latest_history.end_time) && (time_condition || !exam.time_work_minutes)) {
            return { error: MessageError.ERROR_EXPIRES_EXAM, data: null }
        }

        if (condition) {
            console.log("create new history")
            let new_history: Partial<ExamHistory> = {
                start_time: time_current,
                user: user as User,
                exam: exam
            }
            let history = await this.examHistoryRepository.save(new_history)
            let history_answers = questions_random.map(record => {
                return {
                    question: record.question,
                    exam_history: history
                }
            })
            await this.historyAnswerRepository.insert(history_answers)
            latest_history = await history_build_query.getOne()
        }

        let log_question_ids = latest_history.history_answers.sort((a, b) => a.id - b.id).map((i) => {
            return {
                id: i.question_id,
                answer_id: i.answer_id,
            }
        })
        let new_questions_random: any[] = []
        new_questions_random = log_question_ids.map((q) => {
            let find = questions_random.find((question) => question.question_id === q.id)
            find.question.answers.sort((a, b) => a.id - b.id)
            find.question.answers = find.question.answers.map((item) => {
                return {
                    ...item,
                    user_choose: +(q.answer_id) == item.id ? true : false
                }
            })
            return find.question
        })
        let end = new_questions_random.map(i => {
            return {
                question_id: i.id,
                answer_id: i.answers[2].id
            }
        })
        delete latest_history.history_answers
        return {
            error: null,
            data: {
                topic: exam.topic,
                exam: { ...exam, total_question: new_questions_random.length },
                latest_history,
                list: new_questions_random.splice((page - 1) * limit, limit),
                end,
            }
        }
    }

    async endExam(id: number, user: PayloadTokenInterface, body: ExamEndDto): Promise<ResponseServiceInterface<ExamHistory>> {
        let { form } = body
        let exam = await this.findOne({ where: { id } })
        if (!exam) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let time_current = new Date()
        let timeCurrentMili = time_current.getTime()
        // Tăng thêm 10s trước khi nạp bài
        if (exam.time_end && new Date(exam.time_end.getTime() + 10 * 1000) < time_current) {
            return { error: MessageError.ERROR_EXPIRES_EXAM, data: null }
        }
        if (exam.time_start && exam.time_start > time_current) {
            return { error: MessageError.ERROR_EXPIRES_EXAM, data: null }
        }

        let questions_exam = await this.examQuestionRepository.find({
            where: { exam_id: exam.id },
            relations: {
                question: { answers: true }
            }
        })

        let history_exam = await this.examHistoryRepository.findOne({
            where: { exam_id: exam.id, user_id: user.id },
            order: { created_at: "DESC" }
        })
        if (history_exam?.end_time) {
            return { error: MessageError.ERROR_EXPIRES_EXAM, data: null }
        }

        let total_question_correct = 0
        let question_score = exam.score / questions_exam.length
        await Promise.all(
            questions_exam.map(async (row) => {
                let submit_element = form.find(q => q.question_id == row.question_id);
                let correct_row = row.question.answers.find(a => a.id == submit_element?.answer_id)
                if (submit_element) {
                    correct_row?.correct && total_question_correct++
                    let correct = (correct_row != undefined) && correct_row.correct
                    await this.historyAnswerRepository.update({
                        question_id: row.question_id,
                        exam_history_id: history_exam.id
                    }, {
                        score: correct ? question_score : 0,
                        correct,
                        answer_id: String(submit_element.answer_id)
                    })
                }
            })
        )

        history_exam.end_time = new Date()
        history_exam.score = question_score * total_question_correct
        history_exam.total_correct_answer = total_question_correct
        await this.examHistoryRepository.save(history_exam)
        return { error: null, data: history_exam }
    }

    async updateLog(exam_id: number, body: UpdateLogExamDto, user: PayloadTokenInterface): Promise<ResponseServiceInterface<any>> {
        let { question_id, answer_id } = body
        let examHistory = await this.examHistoryRepository.findOne({
            where: {
                user_id: user.id,
                exam_id: exam_id,
            }, order: { created_at: "DESC" }
        })
        if (!examHistory || examHistory.end_time) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        await this.historyAnswerRepository.update({
            question_id,
            exam_history_id: examHistory.id,
        }, {
            answer_id: String(answer_id)
        }
        )
        return { error: null, data: { message: "Done!" } }
    }

    async getExam(id: number): Promise<ResponseServiceInterface<any>> {
        // let { page = 1, limit = 10 } = query
        let exam = await this.findOne({ where: { id } })
        if (!exam || exam.hidden) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let medias = await this.mediaRepository.find({ where: { ref_id: exam.id, ref_type: MediaType.exam } })
        // let [histories, total] = await this.examHistoryRepository.findAndCount({
        //     where: {
        //         user_id: user.id,
        //         exam_id: exam.id
        //     },
        //     order: { created_at: "DESC" },
        //     take: limit,
        //     skip: (page - 1) * limit
        // })

        return { error: null, data: { exam, medias } }
    }

    async getExamForAdmin(exam_id: number, query: any): Promise<ResponseServiceInterface<any>> {
        let { page = 1, limit = 10 } = Helper.transformQueryList(query)
        let exam = await this.findOne({ where: { id: exam_id } })
        if (!exam || exam.hidden) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let medias = await this.mediaRepository.find({ where: { ref_id: exam.id, ref_type: MediaType.exam } })
        let buildQuery = this.examQuestionRepository
            .createQueryBuilder("eq")
            .leftJoin("eq.question", "q")
            .addSelect(["q.id", "q.title", "q.type"])
            .leftJoin("q.answers", "a")
            .addSelect(["a.id", "a.title", "a.correct"])
            .where("eq.exam_id = :exam_id", { exam_id: exam.id })
            .skip((page - 1) * limit)
            .take(limit)
        let [questions, total] = await buildQuery.getManyAndCount()
        return { error: null, data: { exam, questions, page, total, limit, medias } }
    }

    async handleSlug(): Promise<ResponseServiceInterface<any>> {
        return
    }

    async usersInExam(id: number, body: BaseListFilterDto<any, any>): Promise<ResponseServiceInterface<any>> {
        let { page = 1, limit = 20, sort } = body
        let exam = await this.findOne({ where: { id } })
        if (!exam) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null }
        }
        let [histories, total] = await this.examHistoryRepository.findAndCount({
            where: {
                exam_id: exam.id
            },
            order: sort || { created_at: "DESC" },
            take: limit,
            skip: (page - 1) * limit
        })
        histories = histories.map(item => {
            return {
                ...item,
                total_minute_work: Helper.calculateTimeWorkExam(item.start_time, item.end_time)
            }
        })
        return { error: null, data: { list: histories, total, page, limit } }
    }

    async seedDataFromJson(json: JSONImportDto[], list_category_with_topic: any, user: User) {
        for (let row of json) {
            let category_data: Partial<Category> = {
                title: row.title,
                slug: Helper.removeAccents(row.title, true),
                lang_type: row.lang as any
            }
            if (list_category_with_topic[row.title]) {
                let topics = await this.topicRepository.find({ where: { title: In(list_category_with_topic[row.title]) } })
                category_data.topics = topics
            }
            let category_db = await this.categoryRepository.save(category_data)
            await Promise.all(
                row.exams.map(async (exam) => {
                    let exam_data: Partial<Exam> = {
                        title: exam.title,
                        type: ExamType.import,
                        lang_type: exam.lang as any,
                        user,
                    }
                    let exam_db = await this.save(exam_data)

                    await Promise.all(
                        exam.questions.map(async (question) => {
                            let question_data: Partial<Question> = {
                                title: question.title,
                                recommend: question.recommend,
                            }

                            let question_db = await this.questionRepository.save(question_data)
                            await this.examQuestionRepository.save({
                                exam: exam_db,
                                question: question_db
                            })

                            for (let answer of question.answers) {
                                let answer_data: Partial<Answer> = {
                                    title: answer.title,
                                    correct: answer.correct,
                                    question: question_db
                                }
                                await this.answerRepository.save(answer_data)
                            }
                            return question_db
                        })
                    )

                    await this.categoryExamRepository.save({
                        exam: exam_db,
                        category: category_db
                    })
                })
            )
        }
    }

    async calculateCategoryFromSlug(slug: string, user_decode: PayloadTokenInterface, access_topic: { is_access_topic: boolean, is_free: boolean }): Promise<ResponseServiceInterface<any>> {
        let topic = await this.topicRepository.findOne({
            where: { slug: { slug } },
            relations: {
                categories: true
            }
        })
        let total_question = topic.lang_type == ExamLangType.en ? 30 : 60
        if (access_topic.is_free) {
            total_question = 30
        }
        let categories = []
        if (topic.categories.length > total_question) {
            let new_array = Helper.getRandomElements(topic.categories, total_question)
            categories = new_array.map(c => {
                return {
                    percent: Math.floor(100 / new_array.length),
                    category_id: c.id
                }
            })
        } else {
            categories = topic.categories.map(c => {
                return {
                    percent: Math.floor(100 / topic.categories.length),
                    category_id: c.id
                }
            })
        }
        let body_gen: ExamAutoGenerateDto = {
            categories,
            topic_id: topic.id,
            lang_type: topic.lang_type,
            total_question,
            total_work: 1
        }
        let { error, data } = await this.autoGenerateExam(user_decode, body_gen)
        if (error) {
            return { error, data: null }
        }
        return { error: null, data }
    }

    async getExamWithConditionTotalQuestion(topic_id: number, question_count: number) : Promise<ResponseServiceInterface<any>> {
        let exam = await this.repository.createQueryBuilder("e")
            .leftJoinAndSelect("e.topic", "t")
            .leftJoin("e.exam_questions", "eq")
            .where("e.topic_id = :topic_id", { topic_id })
            .andWhere("e.type = :type", { type: ExamType.auto })
            .orderBy("e.id", "ASC")
            .groupBy("e.id")
            .having('COUNT(eq.id) <= :question_count', { question_count })
            .getOne()
        return { error: null, data: exam }
    }

}   
