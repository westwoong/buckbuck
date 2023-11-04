import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ReviewEntity} from "./Review.entity";
import {Repository} from "typeorm";
import {Transactional} from "typeorm-transactional";
import {UserEntity} from "../users/User.entity";
import {CreateReviewRequestDto} from "./dto/createReview.request.dto";
import {PostEntity} from "../posts/Post.entity";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) {
    }

    @Transactional()
    async create(requesterId: number, performerId: number, createReviewRequestDto: CreateReviewRequestDto) {
        const {stars, comment} = createReviewRequestDto;
        /*임시 게시글, 추후 프론트(postId 전달) 추가 후 변경 예정*/
        const post = await this.postRepository.findOne({
            where: {id: 1}
        });
        if (!post) throw new NotFoundException('해당 게시글은 존재하지않습니다.');

        const review = new ReviewEntity({post, stars, comment});

        const requester = await this.userRepository.findOne({
            where: {id: requesterId}
        })
        const performer = await this.userRepository.findOne({
            where: {id: performerId}
        })
        const isExistReview = await this.reviewRepository.findOne({
            where: {
                requesterId: {id: requesterId},
                post: post
            }
        })
        if (isExistReview) throw new BadRequestException('이미 리뷰를 작성했습니다.')
        if (!performer || !requester) throw new NotFoundException('해당 사용자는 존재하지않습니다.');

        review.requesterId = requester;
        review.performerId = performer;

        await this.reviewRepository.save(review);

        return
    }
}
