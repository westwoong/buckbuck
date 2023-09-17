import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./Post.entity";
import {PostController} from './post.controller';
import {PostService} from './post.service';
import {UserEntity} from "../users/User.entity";
import {CommentEntity} from "../comments/Comment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, CommentEntity])],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule {
}
