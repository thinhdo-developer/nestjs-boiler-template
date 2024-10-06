import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let message = (exception as any)?.response?.message;
    let code: string = (exception as any)?.response?.error || 'Exception';
    let status: number =
      (exception as any)?.response?.statusCode ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = (exception as HttpException).getStatus();
      message = (exception as any).getResponse()?.message
        ? (exception as any)?.getResponse().message
        : (exception as any).getResponse();
      code = (exception as HttpException).message;
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
      code: code,
    };
    this.logger.error(exception);
    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
