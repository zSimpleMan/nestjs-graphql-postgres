import { BadRequestException } from "@nestjs/common";
import { isArray, isString } from "class-validator";
import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";

/* 
  {
    select: [
      "role.roleId",
      "role.roleName"
    ],
    joins: [
      {
        leftJoin: {
          relation: "user.userRoles",
          alias: "userrole",
          where:
        }
      },
      {
        leftJoin: {
          relation: "role.userRoles",
          alias: "role",
        }
      }
    ],
    where: {
      
    },
    groupBy: [],
    orderBY: []
  }
*/

export enum Operator {
  AND = '$AND',
  OR = '$OR',
}

export enum JoinType {
  LEFT_JOIN = 'left join',
  INNER_JOIN = 'inner join',
}

export interface IJoinOption {
  type: JoinType,
  relation: string,
  alias: string,
  where?: any
}

export interface IOrderBy {
  field: string,
  order: 'ASC' | 'DESC'
}

export interface ICriterial {
  select?: string[],
  joins: IJoinOption[],
  where?: any,
  groupBy?: string[],
  orderBy?: any,
  having?: any,
  take?: number,
  offset?: number
}

export class QueryParser <T>{

  parser (query: SelectQueryBuilder<T>, criterials: ICriterial) {
    query = this.joinParser(query, criterials.joins)
    query = this.whereParser(query, criterials.where)

    return query
  }

  selectParser (query: SelectQueryBuilder<T>, select: string []) {
    if (!select) { return query }
    query = query.select(select)
  }

  joinParser (query: SelectQueryBuilder<T>, join: IJoinOption[]) {
    if (!isArray(join)) {
      throw new BadRequestException('Invalid criterial!')
    }
    join.map(el => {
      const { type, relation, alias, where = {} } = el

      if (!type || !relation || !alias) {
        throw new BadRequestException('Invalid Criterials!')
      }

      let str = ''
      str = this.whereJoinParser(str, where)

      switch (type) {
        case JoinType.LEFT_JOIN:
          query.leftJoinAndSelect(relation, alias, str)
          break
        case JoinType.INNER_JOIN:
          query.innerJoinAndSelect(relation, alias, str)
        default: break
      }
    })

    return query
  }

  whereJoinParser (
    str: string,
    where: any,
    parentOperator = '$AND'
  ): string {
    if (!where) {
      return ''
    }

    Object.keys(where).forEach(key => {
      if (key.toUpperCase() === Operator.AND) {
        str = this.whereJoinParser(str, where[key], Operator.AND)
      } else if (key.toUpperCase() === Operator.OR) {
        str = this.whereJoinParser(str, where[key], Operator.OR)
      } else {
        const setWhere = {}
        setWhere[key] = where[key]
        str = this.handleWhereJoinArgs(str, setWhere, <Operator>parentOperator)
      }
    })

    return str
  }

  handleWhereJoinArgs (str: string, where: any, andOr: Operator) {
    Object.entries(where).map(item => {
      const [ Operator, filter ] = item

      let op = str === '' ? '' : andOr
    
      switch (Operator) {
        case '$in': {
          const [ field, arr ] = Object.entries(filter)[0]
          str += `${op} ${field} IN (${this.getValue(arr)})`
          break
        }

        case '$not': {
          const [ field, value ] = Object.entries(filter)[0]
          str += `${op} ${field} NOT (${this.getValue(value)})`
          break
        }

        case '$not_in': {
          const [ field, arr ] = Object.entries(filter)[0]
          str += `${op} ${field} NOT IN (${this.getValue(arr)})`
          break
        }

        case '$lt': {
          const [ field, value ] = Object.entries(filter)[0]
          str += `${op} ${field} < (${this.getValue(value)})`
          break
        }

        case '$lte': {
          const [ field, value ] = Object.entries(filter)[0]
          str += `${op} ${field} <= (${this.getValue(value)})`
          break
        }

        case '$gt': {
          const [ field, value ] = Object.entries(filter)[0]
          str += `${op} ${field} > (${this.getValue(value)})`
          break
        }

        case '$gte': {
          const [ field, value ] = Object.entries(filter)[0]
          str += `${op} ${field} >= (${this.getValue(value)})`
          break
        }

        case '$ilike': {
          const [ field, value ] = Object.entries(filter)[0]
          str += `${op} ${field} ILIKE (${this.getValue(value)})`
          break
        }

        case '$not_ilike': {
          const [ field, value ] = Object.entries(filter)[0]
          str += `${op} ${field} NOT ILIKE (${this.getValue(value)})`
          break
        }

        case '$like': {
          const [ field, value ] = Object.entries(filter)[0]
          str += `${op} ${field} LIKE (${this.getValue(value)})`
          break
        }

        case '$not_like': {
          const [ field, value ] = Object.entries(filter)[0]
          str += `${op} ${field} NOT LIKE (${this.getValue(value)})`
          break
        }

        default:
          str += `${op} ${Operator} = (${this.getValue(filter)})`
          break
      }
    })
    return str
  }


  whereParser (
    query: SelectQueryBuilder<T> | WhereExpressionBuilder,
    where: any,
    parentOperator = '$AND'
  ): SelectQueryBuilder<T> {
    if (!where) {
      return query as SelectQueryBuilder<T>
    }

    Object.keys(where).forEach(key => {
      if (key.toUpperCase() === Operator.AND) {
        query = query.andWhere(new Brackets(qb => 
          where[key].map(arr => {
            this.whereParser(qb, arr, Operator.AND)
          })
        ))
      } else if (key.toUpperCase() === Operator.OR) {
        query = query.orWhere(new Brackets(qb => 
          where[key].map(arr => {
            this.whereParser(qb, arr, Operator.OR)
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
      const [ Operator, filter ] = item
    
      switch (Operator) {
        case '$in': {
          const [ field, arr ] = Object.entries(filter)[0]
          query[andOr](`${field} IN (${this.getValue(arr)})`)
          break
        }

        case '$not': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${field} != ${this.getValue(value)}`)
          break
        }

        case '$not_in': {
          const [ field, arr ] = Object.entries(filter)[0]
          query[andOr](`${field} NOT IN (${this.getValue(arr)})`)
          break
        }

        case '$lt': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${field} < ${this.getValue(value)}`)
          break
        }

        case '$lte': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${field} <= ${this.getValue(value)}`)
          break
        }

        case '$gt': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${field} > ${this.getValue(value)}`)
          break
        }

        case '$gte': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${field} >= ${this.getValue(value)}`)
          break
        }

        case '$ilike': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${field} ILIKE ${this.getValue(value)}`)
          break
        }

        case '$not_ilike': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${field} NOT ILIKE ${this.getValue(value)}`)
          break
        }

        case '$like': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${field} LIKE ${this.getValue(value)}`)
          break
        }

        case '$not_like': {
          const [ field, value ] = Object.entries(filter)[0]
          query[andOr](`${field} NOT LIKE ${this.getValue(value)}`)
          break
        }

        default:
          query[andOr](`${Operator} = ${this.getValue(filter)}`)
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
}