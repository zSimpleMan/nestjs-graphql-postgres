import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { BaseEntity } from "src/shared/base-entity/base.entity";

@InputType()
export class CreateCompanyDto extends BaseEntity {
  @Field()
  name: string

  @Field()
  phoneNumber: string

  @Field()
  faxNumber: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  address: string

  @Field()
  website: string
}