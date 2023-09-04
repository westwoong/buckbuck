import {Column, Entity, OneToMany} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {PostEntity} from "../posts/Post.entity";
import {CommentEntity} from "../comments/Comment.entity";


@Entity('users')
export class UserEntity extends DefaultEntityColumn {
    @Column({nullable: false})
    account: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    phoneNumber: string;

    @Column({nullable: false})
    nickName: string;

    @Column({nullable: false})
    address: string;

    @OneToMany(() => PostEntity, (post) => post.user)
    post: PostEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.user)
    comment: CommentEntity[];
}