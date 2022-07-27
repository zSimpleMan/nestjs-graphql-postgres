import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CompanyProviders } from './company.provider';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';

@Module({
  imports: [
    DatabaseModule
  ],
  providers: [
    ...CompanyProviders,
    CompanyResolver,
    CompanyService,
  ]
})
export class CompanyModule {}
