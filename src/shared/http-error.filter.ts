import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    Logger,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        console.log("request:", request.body);
        let error = {};
        if (typeof exception.message === "string") {
            error = {
                "statusCode": 500,
                "error": "Internal Server Error",
                "message": exception.message,
            }
        }
        else error = exception.message;
        const errorResponse = {
            method: request.method,
            ...error,
            timestamp: new Date().toLocaleDateString(),
            path: request.url,
        }
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            Logger.error(
                `${request.method} ${request.url}`,
                exception.stack,
                'ExceptionFilter',
            );
        } else {
            Logger.error(
                `${request.method} ${request.url}`,
                JSON.stringify(errorResponse),
                'ExceptionFilter',
            );
        }

        response.status(status).json(errorResponse);

    }

}
