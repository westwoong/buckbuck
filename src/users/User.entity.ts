import {Column, Entity, JoinColumn, OneToMany} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {PostEntity} from "../posts/Post.entity";
import {CommentEntity} from "../comments/Comment.entity";
import {SignUpRequestDto} from "./dto/signUp.request.dto";
import {ReviewEntity} from "../reviews/Review.entity";


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
    address: string;

    @OneToMany(() => PostEntity, (post) => post.user)
    post: PostEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.user)
    comment: CommentEntity[];

    @OneToMany(() => ReviewEntity, (review) => review.requesterId)
    requesterId: ReviewEntity[];

    @OneToMany(() => ReviewEntity, (review) => review.performerId)
    performerId: ReviewEntity[];


    constructor(signUpRequestDto: SignUpRequestDto) {
        super();
        if (signUpRequestDto) {
            this.account = signUpRequestDto.account;
            this.password = signUpRequestDto.password;
            this.name = signUpRequestDto.name;
            this.email = signUpRequestDto.email;
            this.phoneNumber = signUpRequestDto.phoneNumber;
            this.nickName = signUpRequestDto.nickName;
        }
    }
}