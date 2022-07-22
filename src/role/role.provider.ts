import { DataSource } from 'typeorm';
import { Role } from './entity/role.entity';

export const RoleProviders = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: ['DATA_SOURCE'],
  },
];