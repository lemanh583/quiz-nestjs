import { Controller, Get, UseGuards, Post, Request, Body, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/auth-jwt.guards';
import { Role } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/common/enum/user.enum';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { PayloadTokenInterface, ResponseInterface } from 'src/common/interface';
import { MessageError } from 'src/common/enum/error.enum';
import { plainToClass } from 'class-transformer';
import { UpdatePasswordDto, UpdateUserDto, UserDto } from './dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getProfile(@CurrentUser() u: PayloadTokenInterface) {
        try {
            let user = await this.userService.findOne({ where: { id: u.id } })
            if (!user) {
                throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
            }
            return plainToClass(UserDto, user, { excludeExtraneousValues: true })
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('/')
    async updateProfile(@CurrentUser() u: PayloadTokenInterface, @Body() body: UpdateUserDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.userService.updateProfile(u.id, body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                message: data
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('/change-password')
    async changePassword(@CurrentUser() u, @Body() body: UpdatePasswordDto): Promise<ResponseInterface<any>> {
        try {
            let { error, data } = await this.userService.changePassword(u.id, body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                message: data
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
