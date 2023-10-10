import {DataSource} from "typeorm";
import {CommentEntity} from "../../../comments/Comment.entity";

export class CommentFinder {
    private dataSource: DataSource;
    readonly userId: number;
    readonly postId: number;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    public async getComment() {
        return await this.dataSource.getRepository(CommentEntity).findOne({
            where: {
                id: 1
            }
        });
    }
}
