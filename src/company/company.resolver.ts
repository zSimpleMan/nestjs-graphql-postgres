import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { GraphqlTransactionInterceptor } from "src/middlewares/graphql-intercepter";
import { GraphqlRequestItem } from "src/shared/decorators/request.decorator";
import { Filter } from "src/user/type/where.type";
import { QueryRunner } from "typeorm";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { Company } from "./entity/company.entity";

@Resolver(() => Company)
export class CompanyResolver {
  constructor (
    private companyService: CompanyService
  ) {}

  @UseInterceptors(GraphqlTransactionInterceptor)
  @Mutation(() =>  Company)
  async addNewCompany (
    @Args('company') company: CreateCompanyDto,
    @GraphqlRequestItem('queryRunner') queryRunner: QueryRunner
  ) {
    const rs = await this.companyService.create(company, queryRunner)

    return rs
  }

  @Query(() => [Company])
  async findCompany (
    @Args('filter', { type: () => GraphQLJSON, nullable: true }) where: any
  ) {
    const rs = await this.companyService.findAll({where})

    return rs
  }
}