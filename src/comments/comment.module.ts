import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommentEntity} from "./Comment.entity";
import {CommentService} from './comment.service';
import {CommentController} from './comment.controller';
import {PostEntity} from "../posts/Post.entity";
import {UserEntity} from "../users/User.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity, PostEntity, UserEntity])],
    providers: [CommentService],
    controllers: [CommentController],
})
export class CommentModule {
}
