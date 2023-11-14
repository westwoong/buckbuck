import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./Post.entity";
import {PostController} from './post.controller';
import {PostService} from './post.service';
import {UserEntity} from "../users/User.entity";
import {CommentEntity} from "../comments/Comment.entity";
import {COMMENT_REPOSITORY, POST_REPOSITORY, USER_REPOSITORY} from "../common/injectToken.constant";
import {TypeormPostRepository} from "./typeormPost.repository";
import {TypeormUserRepository} from "../users/typeormUser.repository";
import {TypeormCommentRepository} from "../comments/typeormComment.repository";

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, CommentEntity])],
    controllers: [PostController],
    providers: [
        PostService,
        {provide: POST_REPOSITORY, useClass: TypeormPostRepository},
        {provide: USER_REPOSITORY, useClass: TypeormUserRepository},
        {provide: COMMENT_REPOSITORY, useClass: TypeormCommentRepository}
    ]
})
export class PostModule {
}
