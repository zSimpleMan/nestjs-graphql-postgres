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

  handleWhereArgs (query: WhereExpressionBuilder, where: any, andOr: 'andWhere' | 'orWhere', alias?: string) {
    if (!alias) {
       alias = this.alias
    }

    Object.entries(where).map(item => {
      const [ operator, filter ] = item
    
      switch (operator) {
        case 'in': {
          const [ field, arr ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field, alias)} IN (${this.getValue(arr)})`)
          break
        }

        case 'ne': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field, alias)} != ${this.getValue(value)}`)
          break
        }

        case 'nin': {
          const [ field, arr ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field, alias)} NOT IN (${this.getValue(arr)})`)
          break
        }

        case 'lt': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field, alias)} < ${this.getValue(value)}`)
          break
        }

        case 'lte': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field, alias)} <= ${this.getValue(value)}`)
          break
        }

        case 'gt': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field, alias)} > ${this.getValue(value)}`)
          break
        }

        case 'gte': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field, alias)} >= ${this.getValue(value)}`)
          break
        }

        case 'il': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field, alias)} ILIKE ${this.getValue(value)}`)
          break
        }

        case 'nil': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${this.getField(field, alias)} NOT ILIKE ${this.getValue(value)}`)
          break
        }

        default:
          if (typeof filter === 'object') {
            query = this.handleWhereArgs(query, where[operator], andOr, operator)
          } else {
            query[andOr](`${this.getField(operator, alias)} = ${this.getValue(filter)}`)
          }
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

  getField (field: string, alias: string): string {
    return alias + '.' + field
  }

  sortParser (sort: any, query: SelectQueryBuilder<T>, alias?:string): SelectQueryBuilder<T> {
    if (!alias) {
      alias = this.alias
    }
    sort.map(i => {
      if (isString(i)) {
        query.addOrderBy(this.getField(i, alias), 'ASC')
      } else {
        Object.keys(i).map(x => {
          if (isString(i[x])) {
            query.addOrderBy(this.getField(x, alias), i[x])
          } else {
            query = this.sortParser(i[x], query, x)
          }
        })
      }
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