import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";
import {SwaggerSetupModule} from "./config/swagger.module";
import {envSetup} from "./config/dotenv.config";

async function bootstrap() {
    initializeTransactionalContext();
    envSetup();
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
