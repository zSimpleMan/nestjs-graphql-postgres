import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/shared/services/base.service";
import { Repository } from "typeorm";
import { Department } from "./entity/department.entity";

@Injectable()
export class DepartmentService extends BaseService<Department> {
  constructor (
    @Inject('DEPARTMENT_REPOSITORY')
    private departmentRepository: Repository<Department>
  ) {
    super(departmentRepository)
  }

  async findAll(criterials: any): Promise<Department[]> {
    let query = this.departmentRepository.createQueryBuilder('department')
      .leftJoinAndSelect('department.company', 'company')
      .leftJoinAndSelect('department.childs', 'childs')
      .leftJoinAndSelect('department.parent', 'parent')
    query = this.queryParser.parser(query, criterials)

    const dt = await query.getMany()

    return dt
  }
}