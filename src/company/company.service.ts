import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/shared/services/base.service";
import { Repository } from "typeorm";
import { Company } from "./entity/company.entity";

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor (
    @Inject('COMPANY_REPOSITORY')
    private companyRepository: Repository<Company>
  ) {
    super(companyRepository)
  }

  async findAll(criterials: any): Promise<Company[]> {
    let query = this.companyRepository.createQueryBuilder('company')
      .leftJoinAndSelect('company.departments', 'departments')
    query = this.queryParser.parser(query, criterials)

    const data = await query.getMany()

    return data
  }
}