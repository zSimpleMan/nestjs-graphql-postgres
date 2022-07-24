import { Repository } from "typeorm";
import { QueryParser } from "../helper/query-parser";

export class BaseService <TEntity> {
  private repository: Repository<TEntity>
  private queryParser: QueryParser<TEntity>
  protected alias
  constructor (repository) {
    this.repository = repository
    this.queryParser = new QueryParser()
  }

  async exec (criterials) {
    let query = this.repository.createQueryBuilder(this.alias)
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
}