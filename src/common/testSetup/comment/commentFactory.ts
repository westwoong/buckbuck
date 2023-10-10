import {DataSource} from "typeorm";
import {CommentEntity} from "../../../comments/Comment.entity";

export class CommentFactory {
    private dataSource: DataSource;
    readonly userId: number;
    readonly postId: number;

    constructor(dataSource: DataSource, userId: number, postId: number) {
        this.dataSource = dataSource;
        this.userId = userId;
        this.postId = postId;
    }

    public async createComment() {
        return await this.dataSource.getRepository(CommentEntity).save({
            content: '테스트 댓글 달아봅니다.',
            proposalCost: 15000,
            userId: this.userId,
            postId: this.postId,
        })
    }
}
