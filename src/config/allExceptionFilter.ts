import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    InternalServerErrorException
} from "@nestjs/common";
import {Request, Response} from "express";
import {Logger} from "winston";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger) {
    }

    catch(exception: Error, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        if (!(exception instanceof HttpException)) {
            exception = new InternalServerErrorException('예상치 못한 에러가 발생했습니다 관리자에게 문의바랍니다.');
        }

        const response = (exception as HttpException).getResponse();
        const stack = exception.stack;
        const log = {
            timestamp: new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'}),
            requestUrl: req.url,
            header: req.headers,
            body: req.body,
            response,
            stack
        }
        const errorMessage = JSON.stringify(log, null, 4);
        this.logger.error(`에러가 발생했습니다 확인 바랍니다 \n ${errorMessage}`)

        res.status((exception as HttpException).getStatus()).json(response);
    }
}
