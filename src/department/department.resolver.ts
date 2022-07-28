import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
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

  @Query(() => [Department])
  async findDepartment (
    @Args('filter', { type: () => GraphQLJSON, nullable: true }) where: any
  ) {
    const rs = await this.departmentService.findAll({where})

    return rs
  }
}