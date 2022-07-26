import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { JwtAuth, JwtGraphqlAuth } from 'src/authentication/jwt-authentication.guard';
import { GraphqlTransactionInterceptor } from 'src/middlewares/graphql-intercepter';
import { GraphqlRequestItem, RequestItem } from 'src/shared/decorators/request.decorator';
import { IFindOptions } from 'src/shared/interfaces';
import { QueryRunner } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { PaginateModel } from './models/user.model';
import { Filter } from './type/where.type';
import { UserService } from './user.service';
 
@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
  ) {}
 
  // @UseGuards(JwtGraphqlAuth)
  @Query(() => [User])
  async findUser (
    @Args('filter', { type: () => GraphQLJSON, nullable: true }) where: any,
    @Args('orderBy', { type: () => GraphQLJSON, nullable: true}) orderBy: any
  ) {

    const data = await this.userService.findUser({ where, orderBy })

    return data
  }

  // @Query(() => PaginateModel)
  // async paginate (@Args('filter') filter: Filter) {
  //   const data = await this.userService.findOrPaginate(filter)

  //   return data
  // }

  @UseInterceptors(GraphqlTransactionInterceptor)
  @Mutation(() => User)
  async createUser (@Args('user') user: CreateUserDto, @GraphqlRequestItem('queryRunner') queryRunner: QueryRunner) {
    return this.userService.create(user, queryRunner)
  }
  
}