import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ExamLangType } from 'src/common/enum/exam.enum';
import { PackageType } from 'src/common/enum/package.enum';
import { TopicType } from 'src/common/enum/topic.enum';
import { UserRole } from 'src/common/enum/user.enum';
import { Helper } from 'src/common/helper';
import { Package } from 'src/package/package.entity';
import { Tag } from 'src/tag/tag.entity';
import { TopicService } from 'src/topic/topic.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as fs from "fs"
import { ExamService } from 'src/exam/exam.service';

@Injectable()
export class SeederService implements OnModuleInit {
    private list_topic: string[]
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Package)
        private readonly packageRepository: Repository<Package>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        private readonly topicService: TopicService,
        private readonly examService: ExamService,
    ) {
        this.list_topic = [
            "Kho bạc nhà nước",
            "Hải Quan",
            "Thuế",
            "Thống kê",
            "Bảo hiểm xã hội",
            "Ngân hàng nhà nước",
            "Tiếng Anh"
        ]
    }

    async onModuleInit() {
        if (!eval(process.env.SEED)) return
        await this.seed();
        console.log('Seeding completed.');
    }

    async seed() {
        await Promise.all([
            this.seedAdminAccount(),
            this.seedPackage(),
            this.seedTags(),
            this.createTopic(),
        ])
        await this.seedDataCrawler()
    }

    async seedAdminAccount() {
        let adminAccount = {
            email: process.env.ADMIN_EMAIL,
            name: "admin",
            password: process.env.ADMIN_PASSWORD,
            role: UserRole.ADMIN
        }
        let find = await this.userRepository.findOne({ where: { email: adminAccount.email } })
        if (find) return
        await this.userRepository.save(Object.assign(new User(), adminAccount));
    }

    async seedPackage() {
        let newPackage = {
            title: "Category",
            type: PackageType.activeCategory,
            price: 200000
        }
        let find = await this.packageRepository.findOne({ where: { type: PackageType.activeCategory } })
        if (find) return
        await this.packageRepository.save(Object.assign(new Package(), newPackage));
    }

    async seedTags() {
        let titles = ['left', 'right', 'center', 'slide']
        let data = titles.map(title => {
            return {
                title,
                slug: Helper.removeAccents(title, false)
            }
        })
        await this.tagRepository.insert(data).catch((e) => e)
    }

    mapData() {
        let data = {
            "Kho bạc nhà nước": [
                "Hiến Pháp 2013",
                "Hoạt động công vụ và các nghị định về công chức",
                "Luật Ban Hành Văn Bản QPPL",
                "Luật cán bộ công chức",
                "Luật Tổ Chức Chính Phủ - Quốc Hội",
                "Luật Viên Chức",
                "Nghị định 34-2016 và nghị định 154-2020 hướng dẫn Luật Ban hành văn bản quy phạm pháp luật",
                "Nghị định 101-2017 về đào tạo, bồi dưỡng cán bộ, công chức, viên chức",
                "Nghị Định 123 và 101 quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Bộ, cơ quan ngang bộ",
                "Nghị định 138 Quy định về tuyển dụng, sử dụng và quản lý công chức",
                "Nghị quyết số 76-NQ-CP ngày 15-7-2021"
            ],
            "Hải Quan": [
                "Hoạt động công vụ và các nghị định về công chức",
                "Luật cán bộ công chức",
                "Luật Viên Chức",
                "Nghị định 30-2020 của Chính phủ về công tác văn thư",
                "Nghị định 101-2017 về đào tạo, bồi dưỡng cán bộ, công chức, viên chức",
                "Nghị định 112 về xử lý kỷ luật cán bộ, công chức, viên chức",
                "Hiến Pháp 2013",
                "Luật Ban Hành Văn Bản QPPL",
                "Luật Tổ Chức Chính Phủ - Quốc Hội",
                "Nghị định 34-2016 và nghị định 154-2020 hướng dẫn Luật Ban hành văn bản quy phạm pháp luật",
                "Nghị định 90 về đánh giá, xếp loại chất lượng cán bộ, công chức, viên chức.",
                "Nghị Định 123 và 101 quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Bộ, cơ quan ngang bộ",
                "Nghị định 138 Quy định về tuyển dụng, sử dụng và quản lý công chức",
                "Nghị quyết số 76-NQ-CP ngày 15-7-2021"
            ],
            "Thuế": [
                "Hiến Pháp 2013",
                "Hoạt động công vụ và các nghị định về công chức",
                "Luật Ban Hành Văn Bản QPPL",
                "Luật cán bộ công chức",
                "Luật Phòng chống tham nhũng",
                "Luật Tổ Chức Chính Phủ - Quốc Hội",
                "Luật Tổ Chức chính quyền địa phương",
                "Luật Viên Chức",
                "Nghị định 30-2020 của Chính phủ về công tác văn thư",
                "Nghị định 34-2016 và nghị định 154-2020 hướng dẫn Luật Ban hành văn bản quy phạm pháp luật",
                "Nghị định 90 về đánh giá, xếp loại chất lượng cán bộ, công chức, viên chức.",
                "Nghị định 101-2017 về đào tạo, bồi dưỡng cán bộ, công chức, viên chức",
                "Nghị định 112 về xử lý kỷ luật cán bộ, công chức, viên chức",
                "Nghị Định 123 và 101 quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Bộ, cơ quan ngang bộ",
                "Nghị định 138 Quy định về tuyển dụng, sử dụng và quản lý công chức",
                "Nghị quyết Đại hội 13 của Đảng",
                "Nghị quyết Đại hội đại biểu toàn quốc lần thứ 13 của Đảng",
                "Nghị quyết số 76-NQ-CP ngày 15-7-2021"
            ],
            "Thống kê": [
                "Hiến Pháp 2013",
                "Luật cán bộ công chức",
                "Luật Tổ Chức Chính Phủ - Quốc Hội",
                "Luật Tổ Chức chính quyền địa phương",
                "Luật Viên Chức",
                "Nghị định 112 về xử lý kỷ luật cán bộ, công chức, viên chức",
                "Nghị Định 123 và 101 quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Bộ, cơ quan ngang bộ",
                "Nghị định 138 Quy định về tuyển dụng, sử dụng và quản lý công chức"
            ],
            "Bảo hiểm xã hội": [
                "Hiến Pháp 2013",
                "Luật Ban Hành Văn Bản QPPL",
                "Luật Tổ Chức Chính Phủ - Quốc Hội",
                "Luật Viên Chức",
                "Nghị định 30-2020 của Chính phủ về công tác văn thư",
                "Nghị định 34-2016 và nghị định 154-2020 hướng dẫn Luật Ban hành văn bản quy phạm pháp luật",
                "Nghị định 90 về đánh giá, xếp loại chất lượng cán bộ, công chức, viên chức.",
                "Nghị định 112 về xử lý kỷ luật cán bộ, công chức, viên chức",
                "Nghị định 115-2020 tuyển dụng, sử dụng và quản lý viên chức"
            ],
            "Ngân hàng nhà nước": [
                "Hiến Pháp 2013",
                "Luật cán bộ công chức",
                "Luật Tổ Chức Chính Phủ - Quốc Hội",
                "Nghị định 90 về đánh giá, xếp loại chất lượng cán bộ, công chức, viên chức.",
                "Nghị Định 123 và 101 quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Bộ, cơ quan ngang bộ",
                "Nghị định 138 Quy định về tuyển dụng, sử dụng và quản lý công chức"
            ]
        }
        let obj = {}
        for (let key in data) {
            for (let element of data[key]) {
                if (!obj[element]) {
                    obj[element] = []
                    obj[element].push(key)
                } else {
                    obj[element].push(key)
                }
            }
        }
        console.log(obj)
    }

    async createTopic() {
        await Promise.all(
            this.list_topic.map(async (topic, index) => {
                await this.topicService.createTopic({
                    title: topic,
                    type: TopicType.exam,
                    lang_type: index == this.list_topic.length - 1 ? ExamLangType.en : ExamLangType.vi
                }).catch(e => e)
            })
        )
        // let topic_db = await this.topicService.find({})
        // console.log(topic_db.map(item => { return { id: item.id, title: item.title } }))
    }

    async seedDataCrawler() {
        let string_data = await fs.promises.readFile('./crawler.newcongchucvns.json', 'utf8')
        let string_data_category_topic = await fs.promises.readFile('./category.topic.json', 'utf8')
        let data: any = JSON.parse(string_data)
        let user = await this.userRepository.findOne({ where: { email: process.env.ADMIN_EMAIL } })
        await this.examService.seedDataFromJson(data, JSON.parse(string_data_category_topic), user)
    }



}
