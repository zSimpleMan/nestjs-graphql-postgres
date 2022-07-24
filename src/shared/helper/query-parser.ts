import { BadRequestException } from "@nestjs/common";
import { isArray, isString } from "class-validator";
import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";

export enum Operator {
  AND = 'and',
  OR = 'or',
}


export class QueryParser <T>{

  private alias: string

  parser (query: SelectQueryBuilder<T>, criterials: any) {
    this.alias = query.alias
    if (criterials.relations) {
      query = this.relationParser(criterials.relations, query)
    }

    if (criterials.where) {
      query = this.whereParser(criterials.where, query)
    }

    if (criterials.orderBy) {
      query = this.sortParser(criterials.orderBy, query)
    }

    if (criterials.limit || criterials.page) {
      query = this.paginate(criterials.page, criterials.limit, query)
    }

    return query
  }

  relationParser (relations: string[], query: SelectQueryBuilder<T>) {
    relations.map(i => {
      query.leftJoinAndSelect(this.alias + '.' + i, i)
    })

    return query
  }

  whereParser (
    where: any,
    query: SelectQueryBuilder<T> | WhereExpressionBuilder,
    parentOperator = 'and'
  ): SelectQueryBuilder<T> {
    if (!where) {
      return query as SelectQueryBuilder<T>
    }

    Object.keys(where).forEach(key => {
      if (key === Operator.AND) {
        query = query.andWhere(new Brackets(qb => 
          where[key].map(arr => {
            this.whereParser(arr, qb, Operator.AND)
          })
        ))
      } else if (key === Operator.OR) {
        query = query.orWhere(new Brackets(qb => 
          where[key].map(arr => {
            this.whereParser(arr, qb, Operator.OR)
          })
        ))
      } else {
        const setWhere = {}
        setWhere[key] = where[key]
        query = this.handleWhereArgs(query, setWhere, parentOperator === Operator.AND ? 'andWhere' : 'orWhere')
      }
    })

    return query as SelectQueryBuilder<T>
  }

  handleWhereArgs (query: WhereExpressionBuilder, where: any, andOr: 'andWhere' | 'orWhere') {
    Object.entries(where).map(item => {
      const [ operator, filter ] = item
    
      switch (operator) {
        case 'in': {
          const [ field, arr ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field)} IN (${this.getValue(arr)})`)
          break
        }

        case 'not': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field)} != ${this.getValue(value)}`)
          break
        }

        case 'nin': {
          const [ field, arr ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field)} NOT IN (${this.getValue(arr)})`)
          break
        }

        case 'lt': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field)} < ${this.getValue(value)}`)
          break
        }

        case 'lte': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field)} <= ${this.getValue(value)}`)
          break
        }

        case 'gt': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field)} > ${this.getValue(value)}`)
          break
        }

        case 'gte': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field)} >= ${this.getValue(value)}`)
          break
        }

        case 'il': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field)} ILIKE ${this.getValue(value)}`)
          break
        }

        case 'nil': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field)} NOT ILIKE ${this.getValue(value)}`)
          break
        }

        default:
          query[andOr](`${this.getField(operator)} = ${this.getValue(filter)}`)
          break
      }
    })
    return query
  }

  getValue (value) {
    if (isArray(value)) {
      return value.map(i => {
        if (isString(i))
          return `'${i}'`
        return i
      })
    }

    if (isString(value)) {
      return `'${value}'`
    }

    return value
  }

  getField (field: string): string {
    const str = field.split('_')
    if (str.length === 2) {
      return str[0] + '.' + str[1]
    }

    return this.alias + '.' + str[0]
  }

  sortParser (sort: any, query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    sort.map(i => {
      const [field, value] = Object(i).entries[0]
      query.addOrderBy(this.getField(field), value)
    })

    return query
  }

  paginate (page: number, limit: number, query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    page = page ? page : 0
    limit = limit ? limit : 10
    
    query.skip(limit*page).take(limit)

    return query
  }
}