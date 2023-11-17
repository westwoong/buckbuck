import {DataSource} from "typeorm";
import {CommentEntity} from "../../../comments/Comment.entity";

export class CommentFinder {
    private dataSource: DataSource;

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
