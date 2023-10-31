import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommentEntity} from "./Comment.entity";
import {CommentService} from './comment.service';
import {CommentController} from './comment.controller';
import {PostEntity} from "../posts/Post.entity";
import {UserEntity} from "../users/User.entity";
import {TypeormCommentRepository} from "./typeormComment.repository";
import {COMMENT_REPOSITORY} from "../common/injectToken.constant";

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity, PostEntity, UserEntity])],
    controllers: [CommentController],
    providers: [
        CommentService,
        {
            provide: COMMENT_REPOSITORY, useClass: TypeormCommentRepository
        }
    ],
})
export class CommentModule {
}
