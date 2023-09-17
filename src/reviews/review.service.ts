import {Injectable, NotFoundException} from '@nestjs/common';
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
    async create(performerId: number, createReviewRequestDto: CreateReviewRequestDto) {
        const {stars, comment} = createReviewRequestDto;
        /*임시 게시글, 추후 변경 예정*/
        const post = await this.postRepository.findOne({
            where: {
                id: 4
            }
        });
        if (!post) throw new NotFoundException('해당 게시글은 존재하지않습니다.');

        const review = new ReviewEntity({post, stars, comment});

        const performer = await this.userRepository.findOne({
            where: {
                id: performerId
            }
        })

        if (!performer) {
            throw new NotFoundException('해당 사용자는 존재하지않습니다.');
        }
        /*인가 적용 전 임시 userId, JWT Guard 적용시 변경 예정 */
        review.requesterId = performer;
        review.performerId = performer;

        await this.reviewRepository.save(review);

        return
    }
}
