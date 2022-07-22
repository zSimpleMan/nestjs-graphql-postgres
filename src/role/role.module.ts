import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoleProviders } from './role.provider';

@Module({
  imports: [
    DatabaseModule
  ],
  providers: [
    ...RoleProviders
  ]
})
export class RoleModule {}
