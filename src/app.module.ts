import {Module} from '@nestjs/common';
import {ORMModule} from './config/ORM.module';
import {UserModule} from "./users/user.module";
import {CategoriesModule} from "./categories/categories.module";
import {CommentModule} from "./comments/comment.module";
import {PostModule} from "./posts/post.module";
import {AuthModule} from "./auth/auth.module";
import {ReviewModule} from "./reviews/review.module";

@Module({
    imports: [
        UserModule, CategoriesModule, CommentModule,
        PostModule, ORMModule, AuthModule, PostModule,
        CommentModule, ReviewModule
    ],
})
export class AppModule {
}
