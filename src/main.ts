import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as dotenv from 'dotenv';
import {ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import {SwaggerSetupModule} from "./config/swagger.module";
import * as path from "path";

async function bootstrap() {
    initializeTransactionalContext();
    dotenv.config({
        path: path.resolve(
            process.env.NODE_ENV === 'product' ? '.env.product' :
                process.env.NODE_ENV === 'develop' ? '.env.develop' : '.env.local'
        )
    });
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }));
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
