import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageType } from 'src/common/enum/package.enum';
import { UserRole } from 'src/common/enum/user.enum';
import { Package } from 'src/package/package.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Package)
        private readonly packageRepository: Repository<Package>,
    ) { }

    async onModuleInit() {
        if(!eval(process.env.SEED)) return
        await this.seed();
        console.log('Seeding completed.');
    }

    async seed() {
       await Promise.all([
        this.seedAdminAccount(),
        this.seedPackage()
       ])
    }

    async seedAdminAccount() {
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

    async seedPackage() {
        let newPackage = {
           title: "Category",
           type: PackageType.activeCategory,
           price: 200000
        }
        let find = await this.packageRepository.findOne({where: { type: PackageType.activeCategory }})
        if(find) return
        await this.packageRepository.save(Object.assign(new Package(), newPackage));
    }
}