import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as dotenv from 'dotenv';
import {ValidationPipe} from "@nestjs/common";
import {initializeTransactionalContext} from "typeorm-transactional";

async function bootstrap() {
    initializeTransactionalContext();
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }));
    await app.listen(3000);
}

try{
bootstrap();
console.log('test11');
} catch (err){
    console.log(err)
}
