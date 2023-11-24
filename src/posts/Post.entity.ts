import {Column, Entity, ManyToOne, OneToMany, RelationId} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {UserEntity} from "../users/User.entity";
import {CommentEntity} from "../comments/Comment.entity";
import {PostToCategoriesEntity} from "../categories/PostToCategories.entity";
import {ReviewEntity} from "../reviews/Review.entity";

interface IPostConstructor {
    title: string;
    content: string;
    cost: number;
    level: string;
    userId: number;
}

@Entity('posts')
export class PostEntity extends DefaultEntityColumn {
    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    cost: number;

    @Column()
    level: string

    @OneToMany(() => CommentEntity, (comment) => comment.post)
    comment: CommentEntity[];

    @ManyToOne(() => UserEntity, (user) => user.post, {nullable: false})
    user: UserEntity;

    @Column()
    @RelationId((post: PostEntity) => post.user)
    userId: number;

    @OneToMany(() => PostToCategoriesEntity, (postToCategory) => postToCategory.post)
    postToCategories: PostToCategoriesEntity[];

    @OneToMany(() => ReviewEntity, (review) => review.post)
    review: ReviewEntity[];

    constructor(post: IPostConstructor) {
        super();
        if (post) {
            this.title = post.title;
            this.content = post.content;
            this.cost = post.cost;
            this.level = post.level;
            this.userId = post.userId;
        }
    }
}