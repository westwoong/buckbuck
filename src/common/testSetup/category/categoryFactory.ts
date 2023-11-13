import {CategoriesEntity} from "../../../categories/Categories.entity";
import {DataSource} from "typeorm";

export class CategoryFactory {
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    public async createCategory() {
        return await this.dataSource.getRepository(CategoriesEntity).save({
            name: '테스트해줘'
        })
    }
}