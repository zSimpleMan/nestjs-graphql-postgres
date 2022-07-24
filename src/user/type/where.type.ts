import { ArgsType, createUnionType, Field, InputType } from "@nestjs/graphql";
import { isString } from "class-validator";
import { Operation } from "src/shared/interfaces";
import { GraphQLJSON } from 'graphql-type-json';
import { type } from "os";

export type ValueType = string | number | string[] | number[]

@InputType()
export class Filter {
  @Field(type => GraphQLJSON, { nullable: true })
  where?: any

  @Field(type => [String], { nullable: true })
  relations?: string[]

  @Field({ nullable: true })
  page?: number

  @Field({ nullable: true })
  limit?: number

  @Field(type => GraphQLJSON, { nullable: true })
  orderBy?: any
}

