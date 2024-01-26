import {Injectable} from "@nestjs/common";
import {ReviewRepository} from "./review.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {ReviewEntity} from "./Review.entity";
import {Repository} from "typeorm";
import {PostEntity} from "../posts/Post.entity";

@Injectable()
export class TypeormReviewRepository implements ReviewRepository {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
    ) {
    }

    async findOneByRequesterIdAndPost(requesterId: number, post: PostEntity): Promise<ReviewEntity | null> {
        return await this.reviewRepository.findOne({
            where: {
                requesterId: requesterId,
                post: post
            }
        })
    }

    async save(review: ReviewEntity) {
        return await this.reviewRepository.save(review);
    }
}