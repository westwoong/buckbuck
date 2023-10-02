import {DataSource} from "typeorm";
import {PostEntity} from "../../posts/Post.entity";

export class PostFactory {
    private dataSource: DataSource;
    readonly userId: number;

    constructor(dataSource: DataSource, userId: number) {
        this.dataSource = dataSource;
        this.userId = userId;
    }

    public async createPost() {
        return await this.dataSource.getRepository(PostEntity).save({
            title: '테스트 제목입니다.',
            content: '테스트 내용입니다.',
            cost: 10500,
            level: '고수',
            userId: this.userId
        });
    }

    public async getPost(){
        return await this.dataSource.getRepository(PostEntity).find()
    }
}