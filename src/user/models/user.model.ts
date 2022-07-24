import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { User } from "../entity/user.entity";

@ObjectType()
export class PaginateModel {
  @Field(type => GraphQLJSON)
  paginate: any

  @Field(type => [User])
  data: User[]
}