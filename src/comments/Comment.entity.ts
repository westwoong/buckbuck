import {Column, Entity, ManyToOne} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";

@Entity('comments')
export class CommentEntity extends DefaultEntityColumn {
    @Column()
    content: string;

    @Column()
    proposalCost: number;

    @ManyToOne(() => UserEntity, (user) => user.comment)
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.comment)
    post: PostEntity;

}