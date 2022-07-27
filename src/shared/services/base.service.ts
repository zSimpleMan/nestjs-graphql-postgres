import { QueryRunner, Repository } from "typeorm";
import { QueryParser } from "../helper/query-parser";

export class BaseService <TEntity> {
  private repository: Repository<TEntity>
  public queryParser: QueryParser<TEntity>
  protected alias
  constructor (repository) {
    this.repository = repository
    this.queryParser = new QueryParser()
  }

  async exec (criterials) {
    let query = this.repository.createQueryBuilder('xaxa')
    query = this.queryParser.parser(query, criterials)
    
    return query
  }

  async findAll (criterials) {
    const query = await this.exec(criterials)
    const data = query.getMany()

    return data
  }

  async findOne (criterials) {
    const query = await this.exec(criterials)
    const data = query.getOne()

    return data
  }

  async create (data: any, queryRunner: QueryRunner): Promise<TEntity> {
    const row = this.repository.create(<TEntity>data)

    await queryRunner.manager.save(row)

    return row
  }
}