import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./Post.entity";
import {PostController} from './post.controller';
import {PostService} from './post.service';
import {UserEntity} from "../users/User.entity";
import {CommentEntity} from "../comments/Comment.entity";
import {COMMENT_REPOSITORY, POST_REPOSITORY, UPLOAD_REPOSITORY, USER_REPOSITORY} from "../common/injectToken.constant";
import {TypeormPostRepository} from "./typeormPost.repository";
import {TypeormUserRepository} from "../users/typeormUser.repository";
import {TypeormCommentRepository} from "../comments/typeormComment.repository";
import {UploadEntity} from "../uploads/upload.entity";
import {TypeormUploadRepository} from "../uploads/typeormUpload.repository";

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, CommentEntity, UploadEntity])],
    controllers: [PostController],
    providers: [
        PostService,
        {provide: POST_REPOSITORY, useClass: TypeormPostRepository},
        {provide: USER_REPOSITORY, useClass: TypeormUserRepository},
        {provide: COMMENT_REPOSITORY, useClass: TypeormCommentRepository},
        {provide: UPLOAD_REPOSITORY, useClass: TypeormUploadRepository}
    ]
})
export class PostModule {
}
