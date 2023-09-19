import {Column, Entity, OneToMany} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {PostToCategoriesEntity} from "./PostToCategories.entity";
import {CreateCategoryRequestDto} from "./dto/createCategory.request.dto";

@Entity('categories')
export class CategoriesEntity extends DefaultEntityColumn {
    @Column()
    name: string;

    @OneToMany(() => PostToCategoriesEntity, (postToCategory) => postToCategory.category)
    postToCategories: PostToCategoriesEntity[];

    constructor(createCategoryRequestDto: CreateCategoryRequestDto) {
        super();
        if (createCategoryRequestDto) {
            this.name = createCategoryRequestDto.name;
        }
    }
}