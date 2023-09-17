import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";

@Entity('reviews')
export class ReviewEntity extends DefaultEntityColumn {

    @ManyToOne(() => UserEntity, (user) => user.requesterId)
    @JoinColumn()
    requesterId: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.performerId)
    @JoinColumn()
    performerId: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.review)
    post: PostEntity[];

    @Column()
    stars: number;

    constructor(createReviewRequestDto: {
        requesterId: UserEntity,
        performerId: UserEntity,
        post: PostEntity[],
        starts: number
    }) {
        super();
        if (createReviewRequestDto) {
            this.requesterId = createReviewRequestDto.requesterId;
            this.performerId = createReviewRequestDto.performerId;
            this.post = createReviewRequestDto.post;
            this.stars = createReviewRequestDto.starts;
        }
    }
}