import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enum/user.enum';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        if(!eval(process.env.SEED)) return
        await this.seed();
        console.log('Seeding completed.');
    }

    async seed() {
        let adminAccount = {
            email: process.env.ADMIN_EMAIL,
            name: "admin",
            password: process.env.ADMIN_PASSWORD,
            role: UserRole.ADMIN
        }
        let find = await this.userRepository.findOne({where: {email: adminAccount.email }})
        if(find) return
        await this.userRepository.save(Object.assign(new User(), adminAccount));
    }
}
