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
}