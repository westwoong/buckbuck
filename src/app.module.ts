import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ORMModule} from './config/ORM.module';
import {UserModule} from "./users/user.module";
import {CategoryModule} from "./categories/category.module";
import {CommentModule} from "./comments/comment.module";
import {PostModule} from "./posts/post.module";

@Module({
    imports: [UserModule, CategoryModule, CommentModule, PostModule, ORMModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
