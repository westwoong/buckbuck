import {Column, Entity} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";

@Entity('categories')
export class CategoriesEntity extends DefaultEntityColumn {
    @Column({nullable: false})
    name: string;

}