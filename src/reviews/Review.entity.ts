import {Column, Entity, JoinColumn, ManyToOne, RelationId} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";

interface IReviewConstructor {
    postId: number;
    stars: number;
    comment: string;
    requesterId: number;
    performerId: number;
}

@Entity('reviews')
export class ReviewEntity extends DefaultEntityColumn {

    @ManyToOne(() => UserEntity, (user) => user.requester, {nullable: false})
    @JoinColumn()
    requester: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.performer, {nullable: false})
    @JoinColumn()
    performer: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.review, {nullable: false})
    post: PostEntity;

    @Column()
    @RelationId((review: ReviewEntity) => review.requester)
    requesterId: number;

    @Column()
    @RelationId((review: ReviewEntity) => review.performer)
    performerId: number;

    @Column()
    @RelationId((review: ReviewEntity) => review.post)
    postId: number;

    @Column()
    comment: string;

    @Column()
    stars: number;

    constructor(review: IReviewConstructor) {
        super();
        if (review) {
            this.postId = review.postId;
            this.stars = review.stars;
            this.comment = review.comment;
            this.requesterId = review.requesterId;
            this.performerId = review.performerId;
        }
    }
}