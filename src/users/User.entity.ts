import {Column, Entity, OneToMany} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {PostEntity} from "../posts/Post.entity";
import {CommentEntity} from "../comments/Comment.entity";
import {ReviewEntity} from "../reviews/Review.entity";


interface IUserConstructor {
    account: string;
    password: string
    salt: string;
    address?: string;
    name: string;
    email: string;
    phoneNumber: string;
    nickName: string;
}

@Entity('users')
export class UserEntity extends DefaultEntityColumn {
    @Column()
    account: string;

    @Column()
    password: string;

    @Column({nullable: true})
    salt: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phoneNumber: string;

    @Column()
    nickName: string;

    @Column({nullable: true})
    address?: string;

    @OneToMany(() => PostEntity, (post) => post.user)
    post?: PostEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.user)
    comment?: CommentEntity[];

    @OneToMany(() => ReviewEntity, (review) => review.requesterId)
    requesterId?: ReviewEntity[];

    @OneToMany(() => ReviewEntity, (review) => review.performerId)
    performerId?: ReviewEntity[];


    constructor(user: IUserConstructor) {
        super();
        if (user) {
            this.account = user.account;
            this.password = user.password;
            this.salt = user.salt;
            this.name = user.name;
            this.email = user.email;
            this.phoneNumber = user.phoneNumber;
            this.nickName = user.nickName;
            this.address = user.address;
        }
    }
}