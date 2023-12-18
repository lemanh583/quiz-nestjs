import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { Transaction } from 'src/transaction/transaction.entity';
// import { History } from "../history/history.entity"

@Module({
    imports: [TypeOrmModule.forFeature([User, Transaction])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule { }
