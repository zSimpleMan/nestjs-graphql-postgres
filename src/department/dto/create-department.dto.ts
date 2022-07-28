import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsOptional } from "class-validator";

@InputType()
export class CreateDepartmentDto {
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

  @Field({ nullable: true })
  @IsOptional()
  parentId: number

  @Field()
  companyId: number
}