import {Module} from '@nestjs/common';
import {ORMModule} from './config/ORM.module';
import {UserModule} from "./users/user.module";
import {CategoriesModule} from "./categories/categories.module";
import {CommentModule} from "./comments/comment.module";
import {PostModule} from "./posts/post.module";
import {AuthModule} from "./auth/auth.module";
import {ReviewModule} from "./reviews/review.module";
import {JwtPassportModule} from "./auth/jwtPassport/jwt-passport.module";
import {SwaggerSetupModule} from "./config/swagger.module";
import {UploadModule} from "./uploads/upload.module";
import {LoggerModule} from "./config/logger.module";
import {TaskModule} from './cron/task.module';
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        UserModule, CategoriesModule, CommentModule,
        PostModule, ORMModule, AuthModule, PostModule,
        CommentModule, ReviewModule, CategoriesModule,
        JwtPassportModule, SwaggerSetupModule, UploadModule,
        LoggerModule, ScheduleModule.forRoot(), TaskModule
    ],
})
export class AppModule {
}
