import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ORMModule} from './config/ORM.module';
import {UserModule} from "./users/user.module";
import {CategoriesModule} from "./categories/categories.module";
import {CommentModule} from "./comments/comment.module";
import {PostModule} from "./posts/post.module";

@Module({
    imports: [UserModule, CategoriesModule, CommentModule, PostModule, ORMModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
