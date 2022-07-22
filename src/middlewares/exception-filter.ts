import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    console.log(exception)

    if (host.getType() !== 'http') {
      throw exception;
    }
  
    const ctx = host.switchToHttp();

    let httpStatus
    let { name, message } = exception
  
    if (!exception.status) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
      message = `The server failed to handle this request`
      name = 'InternalServerError'
    } else {
      httpStatus = exception.getStatus();
    }

    const responseBody = {
      type: name,
      error: message,
      details: exception.response ? exception.response.message : undefined
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
