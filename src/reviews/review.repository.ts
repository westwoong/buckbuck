import {ReviewEntity} from "./Review.entity";
import {PostEntity} from "../posts/Post.entity";

export interface ReviewRepository {
    findOneByRequesterIdAndPost(requesterId: number, post: PostEntity): Promise<ReviewEntity | null>

    save(review: ReviewEntity): Promise<ReviewEntity>
}