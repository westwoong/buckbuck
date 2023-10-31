import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./Post.entity";
import {PostController} from './post.controller';
import {PostService} from './post.service';
import {UserEntity} from "../users/User.entity";
import {CommentEntity} from "../comments/Comment.entity";
import {POST_REPOSITORY} from "../common/injectToken.constant";
import {TypeormPostRepository} from "./typeormPost.repository";

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, CommentEntity])],
    controllers: [PostController],
    providers: [
        PostService,
        {
            provide: POST_REPOSITORY, useClass: TypeormPostRepository
        }
    ]
})
export class PostModule {
}
