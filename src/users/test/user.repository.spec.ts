import {INestApplication, ValidationPipe} from "@nestjs/common";
import {DataSource} from "typeorm";
import {TypeormUserRepository} from "../typeormUser.repository";
import {initializeTransactionalContext} from "typeorm-transactional";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../app.module";
import {USER_REPOSITORY} from "../../common/injectToken.constant";
import {UserTokenFactory} from "../../common/testSetup/user/userTokenFactory";
import {UserFinder} from "../../common/testSetup/user/userFinder";
import {UserEntity} from "../User.entity";


describe('UserRepository (E2E)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let userRepository: TypeormUserRepository;

    beforeAll(async () => {
        initializeTransactionalContext();
        dotenv.config();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        dataSource = moduleRef.get<DataSource>(DataSource);
        userRepository = moduleRef.get<TypeormUserRepository>(USER_REPOSITORY);

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
    });

    beforeEach(async () => {
        await dataSource.dropDatabase();
        await dataSource.synchronize();
    })

    describe('findOneById(userId)', () => {
        it('입력한 사용자의 id 값과 같은 사용자의 데이터를 출력한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser();
            const userFinder = new UserFinder(dataSource);
            const userId = await userFinder.userId();

            const foundUser = await userRepository.findOneById(userId);

            expect(foundUser?.name).toBe('홍길동');
        })
    })

    describe('findByEmail(email)', () => {
        it('입력한 이메일로 가입된 사용자의 정보를 출력한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser();

            const foundUser = await userRepository.findByEmail('test11r@example.com');

            await expect(foundUser?.email).toBe('test11r@example.com');
        })
    })

    describe('findByPhoneNumber()', () => {
        it('입력한 핸드폰 번호로 가입된 사용자의 정보를 출력한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser();

            const foundUser = await userRepository.findByPhoneNumber('01052828282');

            await expect(foundUser?.phoneNumber).toBe('01052828282');
        })
    })

    describe('findByAccount()', () => {
        it('입력한 계정으로 가입된 사용자의 정보를 출력한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser();

            const foundUser = await userRepository.findByAccount('xptmxmlqslek123');

            await expect(foundUser?.account).toBe('xptmxmlqslek123');
        })
    })

    describe('findByNickName()', () => {
        it('입력한 닉네임으로 가입된 사용자의 정보를 출력한다', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser();

            const foundUser = await userRepository.findByNickName('빨리점11');

            await expect(foundUser?.nickName).toBe('빨리점11');
        })
    })

    describe('findAll()', () => {
        it('모든 유저의 객체 속성이 존재해야한다.', async () => {
            const userTokenFactory = new UserTokenFactory(dataSource);
            await userTokenFactory.createUser();
            await userTokenFactory.createSecondUser();

            const getUsers = await userRepository.findAll();

            getUsers.forEach(user => {
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('createdAt');
                expect(user).toHaveProperty('updatedAt');
                expect(user).toHaveProperty('account');
                expect(user).toHaveProperty('password');
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('email');
                expect(user).toHaveProperty('phoneNumber');
                expect(user).toHaveProperty('nickName');
                expect(user).toHaveProperty('address');
            })
        })
    })

    describe('save()', () => {
        it('입력받은 회원가입 정보를 저장한다', async () => {
            const signUp = new UserEntity({
                account: "xptmxmlqslek123",
                password: "testpassword123",
                salt: "testPasswordSalt",
                name: '홍길동',
                email: "test11r@example.com",
                phoneNumber: "01052828282",
                nickName: "빨리점11",
            })

            const savedUser = await userRepository.save(signUp);

            const foundUser = await userRepository.findOneById(savedUser.id);

            expect(foundUser).toBeDefined();
        })
    })
})