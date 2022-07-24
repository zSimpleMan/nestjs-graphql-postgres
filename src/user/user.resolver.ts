import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { JwtAuth, JwtGraphqlAuth } from 'src/authentication/jwt-authentication.guard';
import { IFindOptions } from 'src/shared/interfaces';
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
  async findUser (@Args('filter') filter: Filter) {
    const data = await this.userService.findOrPaginate(filter)

    return data
  }

  @Query(() => PaginateModel)
  async paginate (@Args('filter') filter: Filter) {
    const data = await this.userService.findOrPaginate(filter)

    return data
  }
  
}