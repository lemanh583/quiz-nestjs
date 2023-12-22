import { Controller, Get, UseGuards, Post, Request, Body, HttpStatus, HttpException, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/auth-jwt.guards';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { PayloadTokenInterface, ResponseInterface } from 'src/common/interface';
import { MessageError } from 'src/common/enum/error.enum';
import { plainToClass } from 'class-transformer';
import { UpdatePasswordDto, UpdateUserDto, UserDto } from './dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }
    @ApiOperation({ summary: "Get user infor" })
    @Get()
    async getProfile(@CurrentUser() u: PayloadTokenInterface) {
        try {
            let user = await this.userService.findOne({ where: { id: u.id } });
            if (!user) {
                throw new HttpException(MessageError.ERROR_NOT_FOUND, HttpStatus.BAD_REQUEST)
            }
            return plainToClass(UserDto, user, { excludeExtraneousValues: true })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiOperation({ summary: "List transaction of user" })
    @Get('/transactions')
    async listTransaction(@CurrentUser() user: PayloadTokenInterface, @Query() query: any): Promise<any> {
        try {
            let { error, data } = await this.userService.listTransactionForUser(user.id, query)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                ...data
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiOperation({ summary: "update user" })
    @Put('/')
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

    @ApiOperation({ summary: "update password user" })
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
