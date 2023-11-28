import {Column, Entity, ManyToOne, RelationId} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";

interface ICommentConstructor {
    content: string;
    proposalCost: number;
    postId: number;
    userId: number;
}

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

    constructor(comment: ICommentConstructor) {
        super();
        if (comment) {
            this.content = comment.content;
            this.proposalCost = comment.proposalCost;
            this.userId = comment.userId;
            this.postId = comment.postId;
        }
    }

}