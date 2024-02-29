import {INestApplication, Module} from "@nestjs/common";
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger";

@Module({})
export class SwaggerSetupModule {
    static setup(app: INestApplication) {
        const options = new DocumentBuilder()
            .setTitle('buckbuck')
            .setDescription('buckbuck API guide')
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api-docs', app, document);
    }
}