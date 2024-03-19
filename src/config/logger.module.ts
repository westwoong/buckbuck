import {Module} from "@nestjs/common";
import {createLogger, Logger, format} from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";


@Module({
    providers: [
        {
            provide: Logger,
            useFactory: () => {
                const logger = createLogger({
                    level: process.env.NODE_ENV === 'product' ? 'info' : 'debug',
                    format: format.combine(format.timestamp(), format.json()),
                    transports: [],
                });

                // 운영 아닐 시
                if (process.env.NODE_ENV !== 'product') {
                    logger.add(
                        new DailyRotateFile({
                            filename: 'logs/buckbuck-api-debug-%DATE%.log',
                            datePattern: 'YYYY-MM-DD',
                            level: 'debug',
                            zippedArchive: true,
                            maxSize: '100m',
                            maxFiles: '30d',
                        })
                    );
                }

                // 운영일 시
                if (process.env.NODE_ENV === 'product') {
                    logger.add(
                        new DailyRotateFile({
                            filename: 'logs/buckbuck-api-%DATE%.log',
                            datePattern: 'YYYY-MM-DD',
                            zippedArchive: true,
                            maxSize: '100m',
                            maxFiles: '30d',
                        })
                    );
                }

                return logger;
            },
        },
    ],
    exports: [Logger],
})
export class LoggerModule {}