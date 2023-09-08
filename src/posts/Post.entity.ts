import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {UserEntity} from "../users/User.entity";
import {CommentEntity} from "../comments/Comment.entity";
import {PostToCategoriesEntity} from "../categories/PostToCategories.entity";

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

    @ManyToOne(() => UserEntity, (user) => user.post)
    user: UserEntity;

    @OneToMany(() => PostToCategoriesEntity, (postToCategory) => postToCategory.post)
    postToCategories: PostToCategoriesEntity[];

}