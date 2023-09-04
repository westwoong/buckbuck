import {Column, Entity} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";

@Entity('comments')
export class CommentEntity extends DefaultEntityColumn {
    @Column({nullable: false})
    content: string;

    @Column({nullable: false})
    proposalCost: number;

}