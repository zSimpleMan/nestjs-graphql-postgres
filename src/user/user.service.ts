import { Inject, Injectable } from "@nestjs/common";
import { ILike, In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entity/user.entity";
import * as bcrypt from 'bcrypt';
// import { ServiceBase } from "src/shared/services/base.service";
import { InjectRepository } from '@nestjs/typeorm';
import { IExtendsUserRepository } from "./interfaces";
import { BaseService } from "src/shared/services/base.service";

@Injectable()
export class UserService extends BaseService<User> {
  protected override alias = 'user'
  constructor (
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>
  ) {
    super(userRepository)
  }
  
  async findAll (): Promise<User[]> {
    const where = {
      'user.fullName': 'luu nhat han',
      $and: [
        {
          $not_in: {
            'user.email': ['nhathantl@gmail.com', 'nhathanluu456@gmail.com']
          }
        },
        {
          $not: {
            'user.id': 1
          }
        },
        {
          $ilike: {
            'user.email': '%mh%'
          }
        }
      ]
    }
    const data = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .getMany()

    return data
  }

  async create (data: CreateUserDto, queryRunner: QueryRunner): Promise<User> {
    const hashPassword = await bcrypt.hash(data.password, 10)
    data.password = hashPassword
    
    return this.userRepository.create(data)
  }

  async getByEmail (email: string): Promise<User> {
    return this.userRepository.findOneBy({
      email
    })
  }
}