import {
    BadRequestException,
    ConflictException,
    INestApplication,
    NotFoundException,
    ValidationPipe
} from "@nestjs/common";
import {UserService} from "../user.service";
import {TypeormUserRepository} from "../typeormUser.repository";
import * as dotenv from "dotenv";
import {Test, TestingModule} from "@nestjs/testing";
import {USER_REPOSITORY} from "../../common/injectToken.constant";
import {DUMMY_USER_RESOLVE} from "../../common/mockDummyResolve";
import {AuthModule} from "../../auth/auth.module";
import path from "path";


jest.mock('../typeormUser.repository')
jest.mock('typeorm-transactional', () => {
    return {
        Transactional: () => () => ({})
    }
})

describe('UserService', () => {
    let app: INestApplication;
    let userService: UserService;
    let userRepository: TypeormUserRepository;

    beforeAll(async () => {
        dotenv.config({
            path: path.resolve(
                process.env.NODE_ENV === 'product' ? '.env.product' :
                    process.env.NODE_ENV === 'develop' ? '.env.develop' : '.env.local'
            )
        });

        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AuthModule],
            providers: [
                UserService,
                {provide: USER_REPOSITORY, useClass: TypeormUserRepository}
            ],
            exports: [UserService],
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
        userRepository = moduleRef.get<TypeormUserRepository>(USER_REPOSITORY);
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({transform: true}));
    })

    describe('signUp()', () => {
        it('중복된 이메일이 있을 시 409 에러를 반환한다', async () => {
            await jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(DUMMY_USER_RESOLVE);
            await jest.spyOn(userRepository, 'findByPhoneNumber').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findByAccount').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findByNickName').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'save').mockResolvedValue(DUMMY_USER_RESOLVE);
            await expect(userService.signUp(DUMMY_USER_RESOLVE)).rejects.toThrow(ConflictException);
        })

        it('중복된 핸드폰 번호가 있을 시 409 에러를 반환한다', async () => {
            await jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findByPhoneNumber').mockResolvedValue(DUMMY_USER_RESOLVE);
            await jest.spyOn(userRepository, 'findByAccount').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findByNickName').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'save').mockResolvedValue(DUMMY_USER_RESOLVE);
            await expect(userService.signUp(DUMMY_USER_RESOLVE)).rejects.toThrow(ConflictException);
        })

        it('중복된 아이디가 있을 시 409 에러를 반환한다', async () => {
            await jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findByPhoneNumber').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findByAccount').mockResolvedValue(DUMMY_USER_RESOLVE);
            await jest.spyOn(userRepository, 'findByNickName').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'save').mockResolvedValue(DUMMY_USER_RESOLVE);
            await expect(userService.signUp(DUMMY_USER_RESOLVE)).rejects.toThrow(ConflictException);
        })

        it('중복된 닉네임이 있을 시 409 에러를 반환한다', async () => {
            await jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findByPhoneNumber').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findByAccount').mockResolvedValue(null);
            await jest.spyOn(userRepository, 'findByNickName').mockResolvedValue(DUMMY_USER_RESOLVE);
            await jest.spyOn(userRepository, 'save').mockResolvedValue(DUMMY_USER_RESOLVE);
            await expect(userService.signUp(DUMMY_USER_RESOLVE)).rejects.toThrow(ConflictException);
        })
    })

    describe('signIn()', () => {
        it('계정이 존재하지 않는경우 400 에러를 반환한다', async () => {
            await jest.spyOn(userRepository, 'findByAccount').mockResolvedValue(null);
            await expect(userService.signIn(DUMMY_USER_RESOLVE)).rejects.toThrow(BadRequestException);
        })
    })

    describe('findOneById()', () => {
        it('userId 값의 사용자가 없는경우 404 에러를반환한다', async () => {
            const userId = 1;
            await jest.spyOn(userRepository, 'findOneById').mockResolvedValue(null);
            await expect(userService.findOneById(userId)).rejects.toThrow(NotFoundException);
        })
    })

    afterAll(async () => {
        await app.close();
    })
})