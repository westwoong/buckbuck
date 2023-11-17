import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReviewEntity} from "./Review.entity";
import {ReviewController} from './review.controller';
import {ReviewService} from './review.service';
import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";
import {POST_REPOSITORY, REVIEW_REPOSITORY, USER_REPOSITORY} from "../common/injectToken.constant";
import {TypeormReviewRepository} from "./typeormReview.repository";
import {TypeormUserRepository} from "../users/typeormUser.repository";
import {TypeormPostRepository} from "../posts/typeormPost.repository";

@Module({
    imports: [TypeOrmModule.forFeature([ReviewEntity, UserEntity, PostEntity])],
    controllers: [ReviewController],
    providers: [
        ReviewService,
        {provide: REVIEW_REPOSITORY, useClass: TypeormReviewRepository},
        {provide: USER_REPOSITORY, useClass: TypeormUserRepository},
        {provide: POST_REPOSITORY, useClass: TypeormPostRepository}

    ]
})
export class ReviewModule {
}
