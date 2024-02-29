import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as dotenv from 'dotenv';
import {ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import {SwaggerSetupModule} from "./config/swagger.module";

async function bootstrap() {
    initializeTransactionalContext();
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }));

    SwaggerSetupModule.setup(app);

    await app.listen(3000);
}

bootstrap();
