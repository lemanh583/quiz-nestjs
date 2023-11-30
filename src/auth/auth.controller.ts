import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from "@nestjs/common"
import { SignInDto, SignUpDto } from './dto';
import { User } from 'src/user/user.entity';
import { ResponseInterface } from 'src/common/interface/response.interface';
import { JwtAuthGuard } from './guards/auth-jwt.guards';
import { CurrentUser } from './decorator/user.decorator';
import { PayloadTokenInterface } from 'src/common/interface';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/user/dto';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/sign-up')
    async signUp(@Body() body: SignUpDto): Promise<ResponseInterface<{ user: User, token: string }>> {
        try {
            let { error, data, token } = await this.authService.signUp(body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                data: {
                    user: data, token
                }
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('/sign-in')
    async signIn(@Body() body: SignInDto): Promise<ResponseInterface<{ user: UserDto, token: string }>> {
        try {
            let { error, data, token } = await this.authService.signIn(body)
            if (error) {
                throw new HttpException(error, HttpStatus.BAD_REQUEST)
            }
            return {
                code: HttpStatus.OK,
                success: true,
                data: {
                    user: data, token
                }
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get('/whoami')
    @UseGuards(JwtAuthGuard)
    whoAmI(@CurrentUser() user: PayloadTokenInterface) {
        return user
    }

}
