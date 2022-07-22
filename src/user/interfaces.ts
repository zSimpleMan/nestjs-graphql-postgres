import { Repository } from "typeorm";
import { User } from "./entity/user.entity";

export interface IExtendsUserRepository extends Repository<User> {
  getName (): string
}