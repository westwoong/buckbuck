import { Module } from "@nestjs/common";
import { createLogger, format } from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import * as SlackHook from "winston-slack-webhook-transport";
import { ERROR_LOGGER, INFO_LOGGER } from "../common/injectToken.constant";

@Module({
    providers: [
        {
            provide: ERROR_LOGGER,
            useFactory: () => {
                return createLogger({
                    level: process.env.NODE_ENV === 'product' ? 'error' : 'debug',
                    format: format.combine(format.timestamp(), format.json()),
                    transports: process.env.NODE_ENV === 'local' ? [
                        new DailyRotateFile({
                            filename: 'logs/buckbuck-api-error-%DATE%.log',
                            datePattern: 'YYYY-MM-DD',
                            zippedArchive: true,
                            maxSize: '100m',
                            maxFiles: '30d',
                        }),
                    ] : [
                        new DailyRotateFile({
                            filename: 'logs/buckbuck-api-error-%DATE%.log',
                            datePattern: 'YYYY-MM-DD',
                            zippedArchive: true,
                            maxSize: '100m',
                            maxFiles: '30d',
                        }),
                        new SlackHook({
                            webhookUrl: process.env.SLACK_URL!,
                            channel: '#error_notification',
                            level: process.env.NODE_ENV === 'product' ? 'error' : 'debug',
                            iconEmoji: 'warning',
                            username: 'error-bot'
                        }),
                    ],
                });
            },
        },
        {
            provide: INFO_LOGGER,
            useFactory: () => {
                return createLogger({
                    level: process.env.NODE_ENV === 'product' ? 'info' : 'debug',
                    format: format.combine(format.timestamp(), format.json()),
                    transports: process.env.NODE_ENV === 'local' ? [
                        new DailyRotateFile({
                            filename: 'logs/buckbuck-api-info-%DATE%.log',
                            datePattern: 'YYYY-MM-DD',
                            zippedArchive: true,
                            maxSize: '100m',
                            maxFiles: '30d',
                        }),
                    ] : [
                        new DailyRotateFile({
                            filename: 'logs/buckbuck-api-info-%DATE%.log',
                            datePattern: 'YYYY-MM-DD',
                            zippedArchive: true,
                            maxSize: '100m',
                            maxFiles: '30d',
                        }),
                        new SlackHook({
                            webhookUrl: process.env.SLACK_URL!,
                            channel: '#info_notification',
                            level: process.env.NODE_ENV === 'product' ? 'info' : 'debug',
                            iconEmoji: 'bulb',
                            username: 'info-bot'
                        }),
                    ],
                });
            },
        },
    ],
    exports: [ERROR_LOGGER, INFO_LOGGER],
})
export class LoggerModule {}
