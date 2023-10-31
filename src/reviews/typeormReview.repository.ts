import {Injectable} from "@nestjs/common";
import {ReviewRepository} from "./review.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {ReviewEntity} from "./Review.entity";
import {Repository} from "typeorm";

@Injectable()
export class TypeormReviewRepository implements ReviewRepository {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
    ) {
    }

    async save(review: ReviewEntity) {
        return await this.reviewRepository.save(review);
    }
}