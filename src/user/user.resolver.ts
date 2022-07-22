import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { JwtAuth, JwtGraphqlAuth } from 'src/authentication/jwt-authentication.guard';
import { IFindOptions } from 'src/shared/interfaces';
import { User } from './entity/user.entity';
import { Filter } from './type/where.type';
import { UserService } from './user.service';
 
@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
  ) {}
 
  // @UseGuards(JwtGraphqlAuth)
  @Query(() => [User])
  async find(@Args('filter') filter: Filter) {
    console.log(filter)
    const data = await this.userService.findAll()
    return data
  }
}