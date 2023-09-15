import {Column, Entity, OneToMany} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {PostToCategoriesEntity} from "./PostToCategories.entity";

@Entity('categories')
export class CategoriesEntity extends DefaultEntityColumn {
    @Column()
    name: string;

    @OneToMany(() => PostToCategoriesEntity, (postToCategory) => postToCategory.category)
    postToCategories: PostToCategoriesEntity[];

}