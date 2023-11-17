import {DataSource} from "typeorm";
import {UserEntity} from "../../../users/User.entity";
import {AuthService} from "../../../auth/auth.service";

export class UserTokenFactory {
    private dataSource: DataSource;
    private authService: AuthService;

    constructor(dataSource: DataSource, authService?: AuthService)
    constructor(dataSource: DataSource, authService: AuthService) {
        this.dataSource = dataSource;
        this.authService = authService;
    }

    public async createUser() {
        return await this.dataSource.getRepository(UserEntity).save({
            account: "xptmxmlqslek123",
            password: "testpassword123",
            name: '홍길동',
            email: "test11r@example.com",
            phoneNumber: "01052828282",
            nickName: "빨리점11",
        });
    }

    public async createUserToken() {
        const user = await this.dataSource.getRepository(UserEntity).save({
            account: "xptmxmlqslek123",
            password: "testpassword123",
            name: '홍길동',
            email: "test11r@example.com",
            phoneNumber: "01052828282",
            nickName: "빨리점11",
        });
        return this.authService.signInWithJwt({userId: user.id})
    }

    public async createSecondUserToken() {
        const user = await this.dataSource.getRepository(UserEntity).save({
            account: "xptmxmlqslek1234",
            password: "testpassword1234",
            name: '길동이',
            email: "test1234@example.com",
            phoneNumber: "01082825252",
            nickName: "빨리점22",
        });
        return this.authService.signInWithJwt({userId: user.id})
    }
}