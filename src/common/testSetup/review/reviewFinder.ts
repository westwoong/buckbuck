import {DataSource} from "typeorm";
import {ReviewEntity} from "../../../reviews/Review.entity";

export class ReviewFinder {
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    public async getReview() {
        return await this.dataSource.getRepository(ReviewEntity).findOne({
            where: {
                id: 1
            }
        });
    }
}
