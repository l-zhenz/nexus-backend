// src/utils/response.ts

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

// 定义可能的异常响应结构
interface ExceptionResponse {
  message?: string | string[];
  [key: string]: any;
}

export class ErrorResponse implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // 使用类型守卫增强安全性
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const typedResponse = exceptionResponse as ExceptionResponse;
        const validationErrors = typedResponse.message;

        if (Array.isArray(validationErrors)) {
          message = validationErrors.join('; ');
        } else if (typeof validationErrors === 'string') {
          message = validationErrors;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    }

    response.status(status).json({
      code: status,
      success: false,
      message: message,
    });
  }
}
