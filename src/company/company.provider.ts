import { DataSource } from "typeorm";
import { Company } from "./entity/company.entity";

export const CompanyProviders = [
  {
    provide: 'COMPANY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Company),
    inject: ['DATA_SOURCE'],
  },
];