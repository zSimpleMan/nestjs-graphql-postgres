import { DataSource } from 'typeorm';
import { Test1 } from './entity/test.entity';

export const TestProviders = [
  {
    provide: 'TEST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Test1),
    inject: ['DATA_SOURCE'],
  },
];