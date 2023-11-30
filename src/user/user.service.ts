import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindOneOptions, FindOptionsWhere, Not, Repository } from 'typeorm';
import { UpdatePasswordDto, UpdateUserDto } from './dto';
import { ResponseServiceInterface } from 'src/common/interface';
import { MessageError } from 'src/common/enum/error.enum';
import * as argon2 from "argon2"

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }
    
    async findOne(condition: FindOneOptions<User>): Promise <User> {
        return this.userRepository.findOne(condition)
    }

    async updateOne(condition: FindOptionsWhere<User>, data: User): Promise <User> {
        let user = await this.userRepository.findOneBy(condition)
        let updateData = Object.assign(user, data) 
        return this.userRepository.save(updateData);
    }

    async updateProfile(id: string, data: UpdateUserDto): Promise<ResponseServiceInterface<string>> {
        let user = await this.findOne({ where: { id } })
        if (!user) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null };
        }
        if (data.email) {
            let email = await this.findOne({ where: { email: data.email, id: Not(user.id) } })
            if (email) {
                return { error: MessageError.ERROR_EXISTS, data: null}
            }
        }
        await this.updateOne({ id }, data as User)
        return { error: null, data: "Done!" }
    }

    async changePassword(id: string, data: UpdatePasswordDto): Promise<ResponseServiceInterface<any>> {
        let { new_password, old_password } = data
        let user = await this.findOne({ where: { id } })
        if (!user) {
            return { error: MessageError.ERROR_NOT_FOUND, data: null };
        }
        let verify = await argon2.verify(user.password, old_password)
        if (!verify) {
            return { error: MessageError.ERROR_INVALID_PASSWORD, data: null };
        }
        let hash = await argon2.hash(new_password,)
        await this.updateOne({ id }, { password: hash } as User)
        return { error: null, data: "Done!" };
    }

}
