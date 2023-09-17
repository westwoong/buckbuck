import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";
import {CreateReviewRequestDto} from "./dto/createReview.request.dto";

@Entity('reviews')
export class ReviewEntity extends DefaultEntityColumn {

    @ManyToOne(() => UserEntity, (user) => user.requesterId)
    @JoinColumn()
    requesterId: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.performerId)
    @JoinColumn()
    performerId: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.review)
    post: PostEntity;

    @Column()
    comment: string;

    @Column()
    stars: number;

    constructor(createReviewRequestDto: CreateReviewRequestDto) {
        super();
        if (createReviewRequestDto) {
            this.post = createReviewRequestDto.post;
            this.stars = createReviewRequestDto.stars;
            this.comment = createReviewRequestDto.comment;
        }
    }
}