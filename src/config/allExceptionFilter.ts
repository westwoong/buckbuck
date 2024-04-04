import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException, Inject,
    InternalServerErrorException
} from "@nestjs/common";
import {Request, Response} from "express";
import {Logger} from "winston";
import {ERROR_LOGGER} from "../common/injectToken.constant";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(ERROR_LOGGER)
        private readonly errorLogger: Logger
    ) {
    }

    catch(exception: Error, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const stack = [];

        if (!(exception instanceof HttpException)) {
            stack.push(exception.stack)
            this.errorLogger.debug(exception.stack);
            exception = new InternalServerErrorException('예상치 못한 에러가 발생했습니다 관리자에게 문의바랍니다.');
        }

        const response = (exception as HttpException).getResponse();
        const log = {
            timestamp: new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'}),
            requestUrl: req.url,
            header: req.headers,
            body: req.body,
            response,
            stack
        }
        const errorMessage = JSON.stringify(log, null, 4);
        if ((exception as HttpException).getStatus() === 500) {
            this.errorLogger.error(`에러가 발생했습니다 확인 바랍니다 \n ${errorMessage}`);
        }
        res.status((exception as HttpException).getStatus()).json(response);
    }
}
