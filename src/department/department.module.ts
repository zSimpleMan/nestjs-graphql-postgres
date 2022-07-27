import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DepartmentProviders } from './department.provider';
import { DepartmentResolver } from './department.resolver';
import { DepartmentService } from './department.service';

@Module({
  imports: [
    DatabaseModule
  ],
  providers: [
    ...DepartmentProviders,
    DepartmentResolver,
    DepartmentService,
  ]
})
export class DepartmentModule {}
