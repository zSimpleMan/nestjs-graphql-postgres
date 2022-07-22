export interface IFindOptions {
  code: string,
  operation: Operation,
  value: string | number | string [] | number[]
}

export enum Operation {
  IN = 'in',
  NOT_IN = 'nin',
  OR = 'or',
  AND = 'and',
  EQUAL = 'e',
  NOT_EQUAL = 'ne',
  ILIKE = 'il',
  NOT_ILIKE = 'nil',
  LT = 'lt',
  LTE = 'lte',
  GT = 'gt',
  GTE ='gte'
}