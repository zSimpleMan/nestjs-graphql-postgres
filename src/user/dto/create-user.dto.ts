import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, Length } from "class-validator";
@InputType()
export class CreateUserDto {
  @IsEmail()
  @Field()
  email: string

  @Length(8)
  @Field()
  password: string

  @Field()
  fullName: string

  @Field()
  birthday: Date
}