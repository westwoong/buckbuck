import {Column, Entity, ManyToOne} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";
import {CreateCommentRequestDto} from "./dto/createComment.request.dto";

@Entity('comments')
export class CommentEntity extends DefaultEntityColumn {
    @Column()
    content: string;

    @Column()
    proposalCost: number;

    @ManyToOne(() => UserEntity, (user) => user.comment, {nullable: false})
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.comment, {nullable: false})
    post: PostEntity;

    constructor(createCommentRequestDto: CreateCommentRequestDto) {
        super();
        if (createCommentRequestDto) {
            this.content = createCommentRequestDto.content;
            this.proposalCost = createCommentRequestDto.proposalCost;
        }
    }

}