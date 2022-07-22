import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string

  @Length(8)
  password: string

  fullName: string

  birthday: Date
}