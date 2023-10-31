import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReviewEntity} from "./Review.entity";
import {ReviewController} from './review.controller';
import {ReviewService} from './review.service';
import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";
import {REVIEW_REPOSITORY} from "../common/injectToken.constant";
import {TypeormReviewRepository} from "./typeormReview.repository";

@Module({
    imports: [TypeOrmModule.forFeature([ReviewEntity, UserEntity, PostEntity])],
    controllers: [ReviewController],
    providers: [
        ReviewService,
        {
            provide: REVIEW_REPOSITORY, useClass: TypeormReviewRepository
        }
    ]
})
export class ReviewModule {
}
