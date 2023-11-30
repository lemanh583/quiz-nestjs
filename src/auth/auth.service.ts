import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { SignInDto, SignUpDto } from './dto';
import { MessageError } from 'src/common/enum/error.enum';
import { ResponseServiceInterface, PayloadTokenInterface } from 'src/common/interface';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from "argon2"
import { UserDto } from 'src/user/dto/user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async signUp(body: SignUpDto): Promise<ResponseServiceInterface<User> & { token?: string }> {
        let { email } = body
        let exists = await this.userRepository.findOne({ where: { email } })
        if (exists) {
            return { error: MessageError.ERROR_EXISTS, data: null }
        }
        const entity = Object.assign(new User(), body);
        const newUser = await this.userRepository.save(entity)
        let payload: PayloadTokenInterface = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
        }
        const token = this.jwtService.sign(payload, { expiresIn: '30d' })
        return {
            error: null,
            data: newUser,
            token
        }
    }

    async signIn(body: SignInDto): Promise<ResponseServiceInterface<UserDto> & { token?: string }> {
        let { email, password } = body
        let user: UserDto = await this.userRepository.findOne({ where: { email } })
        if (!user) {
            return { error: MessageError.ERROR_SIGN_IN, data: null }
        }
        let verify = await argon2.verify(user.password, password)
        if (!verify) {
            return { error: MessageError.ERROR_SIGN_IN, data: null }
        }
        let payload: PayloadTokenInterface = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
        const token = this.jwtService.sign(payload, { expiresIn: '30d' })
        return {
            error: null,
            data: UserDto.plainToClass(user),
            token
        }
    }


}
