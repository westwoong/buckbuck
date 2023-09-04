import {Column, Entity} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";

@Entity('posts')
export class PostEntity extends DefaultEntityColumn {
    @Column({nullable: false})
    title: string;

    @Column({nullable: false})
    content: string;

    @Column({nullable: false})
    cost: number;

    @Column({nullable: false})
    level: string

}