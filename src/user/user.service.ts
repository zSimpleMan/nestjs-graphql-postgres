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
  
  async findOrPaginate (criterials): Promise<any> {

    const data = await super.findAll(criterials)

    if (criterials.limit || criterials.page) {
      const paginate = {
        page: criterials.page,
        limit: criterials.limit,
        total: data.length
      }

      return {
        data,
        paginate
      }
    }

    return data
  }

  async create (data: CreateUserDto, queryRunner: QueryRunner): Promise<User> {
    const hashPassword = await bcrypt.hash(data.password, 10)
    data.password = hashPassword
    
    const row = this.userRepository.create(data)

    await queryRunner.manager.save(row)
    
    delete row.password

    return row
  }

  async getByEmail (email: string): Promise<User> {
    return this.userRepository.findOneBy({
      email
    })
  }

  async findUser (criterials: any) {
    let query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.tests', 'tests')
      .leftJoinAndSelect('tests.test1s', 'test1s')
    query = this.queryParser.parser(query, criterials)

    const data = await query.getMany()

    return data
  }
}