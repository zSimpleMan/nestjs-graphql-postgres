import { ArgsType, createUnionType, Field, InputType } from "@nestjs/graphql";
import { isString } from "class-validator";
import { Operation } from "src/shared/interfaces";
import { GraphQLJSON } from 'graphql-type-json';

export type ValueType = string | number | string[] | number[]

@InputType()
export class Filter {
  @Field(type => GraphQLJSON)
  where?: any

  @Field(type => [String])
  relations: string[]
}

