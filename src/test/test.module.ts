import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TestProviders } from './test.provider';

@Module({
  imports: [
    DatabaseModule
  ],
  providers: [
    ...TestProviders
  ]
})
export class TestModule {}
