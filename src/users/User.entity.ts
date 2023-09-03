import {Column, Entity} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";


@Entity('users')
export class UserEntity extends DefaultEntityColumn {
    @Column({nullable: false})
    account: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    phoneNumber: string;

    @Column({nullable: false})
    nickName: string;

    @Column({nullable: false})
    address: string;


}