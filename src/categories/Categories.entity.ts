import {Column, Entity, OneToMany} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {PostToCategoriesEntity} from "./PostToCategories.entity";

interface ICategoryConstructor {
    name: string;
}

@Entity('categories')
export class CategoriesEntity extends DefaultEntityColumn {
    @Column()
    name: string;

    @OneToMany(() => PostToCategoriesEntity, (postToCategory) => postToCategory.category)
    postToCategories: PostToCategoriesEntity[];

    constructor(category: ICategoryConstructor) {
        super();
        if (category) {
            this.name = category.name;
        }
    }
}