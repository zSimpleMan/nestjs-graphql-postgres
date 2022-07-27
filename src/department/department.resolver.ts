import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { GraphqlTransactionInterceptor } from "src/middlewares/graphql-intercepter";
import { GraphqlRequestItem } from "src/shared/decorators/request.decorator";
import { QueryRunner } from "typeorm";
import { DepartmentService } from "./department.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { Department } from "./entity/department.entity";

@Resolver(() => Department)
export class DepartmentResolver {
  constructor (
    private departmentService: DepartmentService
  ) {}

  @UseInterceptors(GraphqlTransactionInterceptor)
  @Mutation(() => Department)
  async addNewDepartment (
    @Args('department') department: CreateDepartmentDto,
    @GraphqlRequestItem('queryRunner') queryRunner: QueryRunner
  ) {
    const rs = await this.departmentService.create(department, queryRunner)
    
    return rs
  }
}