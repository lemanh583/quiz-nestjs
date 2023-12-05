import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync(
    {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.SECRET_KEY_TOKEN,
      }),
      inject: [ConfigService],
    }),
  // PassportModule.register({
  //   property: 'owner',
  // })
  ]
  ,
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
// configService.get<string>('SECRET_KEY_TOKEN')
export class AuthModule { }
