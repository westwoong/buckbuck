import {ReviewEntity} from "./Review.entity";

export interface ReviewRepository {
    save(review: ReviewEntity): Promise<ReviewEntity>
}