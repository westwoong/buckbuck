import {Column, Entity, ManyToOne, RelationId} from "typeorm";
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

    @Column()
    @RelationId((comment: CommentEntity) => comment.user)
    userId: number;

    @ManyToOne(() => PostEntity, (post) => post.comment, {nullable: false})
    post: PostEntity;

    @Column()
    @RelationId((comment: CommentEntity) => comment.post)
    postId: number;

    constructor(createCommentRequestDto: CreateCommentRequestDto) {
        super();
        if (createCommentRequestDto) {
            this.content = createCommentRequestDto.content;
            this.proposalCost = createCommentRequestDto.proposalCost;
        }
    }

}