import {DataSource} from "typeorm";
import {UserEntity} from "../../../users/User.entity";

export class UserFinder {
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    public async userId() {
        const user = await this.dataSource.getRepository(UserEntity).findOne({
            where: {
                account: 'xptmxmlqslek123'
            }
        })

        if (!user) throw Error('Error: userId is null');

        return user.id;
    }
}