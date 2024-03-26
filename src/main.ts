import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import {SwaggerSetupModule} from "./config/swagger.module";
import {envSetup} from "./config/dotenv.config";
import {AllExceptionFilter} from "./config/allExceptionFilter";
import {ERROR_LOGGER} from "./common/injectToken.constant";

async function bootstrap() {
    initializeTransactionalContext();
    envSetup();
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }));
    const logger = app.get(ERROR_LOGGER);
    app.useGlobalFilters(new AllExceptionFilter(logger));
    app.enableCors({
        methods: ['GET', 'PATCH', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 900,
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    SwaggerSetupModule.setup(app);

    await app.listen(3000);
}

bootstrap();
