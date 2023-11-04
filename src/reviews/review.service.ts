import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ReviewEntity} from "./Review.entity";
import {Repository} from "typeorm";
import {Transactional} from "typeorm-transactional";
import {CreateReviewRequestDto} from "./dto/createReview.request.dto";
import {POST_REPOSITORY, REVIEW_REPOSITORY, USER_REPOSITORY} from "../common/injectToken.constant";
import {UserRepository} from "../users/user.repository";
import {PostRepository} from "../posts/post.repository";
import {ReviewRepository} from "./review.repository";

@Injectable()
export class ReviewService {
    constructor(
        @Inject(REVIEW_REPOSITORY)
        private readonly reviewRepository: ReviewRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(POST_REPOSITORY)
        private readonly postRepository: PostRepository,
    ) {
    }

    @Transactional()
    async create(requesterId: number, performerId: number, createReviewRequestDto: CreateReviewRequestDto) {
        const {stars, comment} = createReviewRequestDto;

        const tempPostId = 1;
        /*임시 게시글, 추후 프론트(postId 전달) 추가 후 변경 예정*/
        const post = await this.postRepository.findOneById(tempPostId);

        if (!post) throw new NotFoundException('해당 게시글은 존재하지않습니다.');

        const review = new ReviewEntity({post, stars, comment});

        const requester = await this.userRepository.findOneById(requesterId);
        const performer = await this.userRepository.findOneById(performerId);

        const isExistReview = await this.reviewRepository.findOneByRequesterIdAndPost(requesterId, post);

        if (isExistReview) throw new BadRequestException('이미 리뷰를 작성했습니다.')
        if (!performer || !requester) throw new NotFoundException('해당 사용자는 존재하지않습니다.');

        review.requesterId = requester;
        review.performerId = performer;

        await this.reviewRepository.save(review);

        return
    }
}
