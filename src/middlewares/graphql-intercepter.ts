import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class GraphqlTransactionInterceptor implements NestInterceptor {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context)

    const req = ctx.getContext().req

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    req.queryRunner = queryRunner;

    return next.handle().pipe(
      tap(async () => {
        await queryRunner.commitTransaction();
      }),
      catchError(async (err) => {
        await queryRunner.rollbackTransaction();

        return throwError(() => err)
      }),
    ).toPromise()
  }
}