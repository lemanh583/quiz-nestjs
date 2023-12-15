import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { User } from 'src/user/user.entity';
import { Package } from 'src/package/package.entity';
import { Category } from 'src/category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Package, Category])
  ],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {}
