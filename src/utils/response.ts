import {
  ArgumentsHost,
  CallHandler,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

interface SuccessResponseData<T> {
  code: number;
  msg: string;
  data: T;
}

export class SuccessResponse<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseData<T>> {
    return next.handle().pipe(
      map((data: T) => {
        return {
          code: 1,
          data,
          msg: '请求成功',
        };
      }),
    );
  }
}

export class ErrorResponse implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    response.status(status).json({
      code: status,
      success: false,
      message: exceptionResponse,
    });
  }
}
