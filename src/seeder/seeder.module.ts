import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Package } from 'src/package/package.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([User, Package])
  ],
  providers: [SeederService]
})
export class SeederModule {}
