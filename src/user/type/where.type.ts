import { ArgsType, createUnionType, Field, InputType } from "@nestjs/graphql";
import { isString } from "class-validator";
import { Operation } from "src/shared/interfaces";

export type ValueType = string | number | string[] | number[]

@InputType()
export class WhereOption {
  @Field()
  code: string

  @Field()
  operator: string
  
  @Field()
  value: string
}

@InputType()
export class Filter {
  @Field(type => [WhereOption])
  where?: WhereOption[]
}

