import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserProviders } from './user.provider';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserResolver,
    UserService,
    ...UserProviders,
  ],
  exports: [
    UserService,
  ]
})
export class UserModule {}
