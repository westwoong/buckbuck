import {DataSource} from "typeorm";
import {PostEntity} from "../../../posts/Post.entity";

export class PostFinder {
    private dataSource: DataSource;
    readonly userId: number;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    public async getPost() {
        return await this.dataSource.getRepository(PostEntity).findOne({
            where: {
                id: 1
            }
        })
    }
}