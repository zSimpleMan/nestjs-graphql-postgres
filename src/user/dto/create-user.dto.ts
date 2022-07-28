import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, Length } from "class-validator";
@InputType()
export class CreateUserDto {

  @Field()
  username: string

  @IsEmail()
  @Field()
  email: string

  @Length(8)
  @Field()
  password: string

  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  departmentId: number
}