import {
    BadRequestException,
    ConflictException, Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {SignUpRequestDto} from "./dto/signUp.request.dto";
import {UserEntity} from "./User.entity";
import {Transactional} from "typeorm-transactional";
import * as crypto from "crypto";
import {SignInRequestDto} from "./dto/signIn.request.dto";
import {AuthService} from "../auth/auth.service";
import {FindUserIdResponseDto} from "./dto/findUserId.response.dto";
import {INFO_LOGGER, USER_REPOSITORY} from "../common/injectToken.constant";
import {UserRepository} from "./user.repository";
import {GetUsersResponseDto} from "./dto/findUsers.response.dto";
import {Logger} from "winston";

const ITERATIONS = 105820;
const KEY_LENGTH = 64;

@Injectable()
export class UserService {

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
        @Inject(INFO_LOGGER)
        private readonly infoLogger: Logger,
    ) {
    }

    @Transactional()
    async signUp(signUpRequestDto: SignUpRequestDto) {
        const {account, password, name, email, phoneNumber, nickName} = signUpRequestDto;

        const isDuplicateEmail = await this.userRepository.findByEmail(email);
        if (isDuplicateEmail) throw new ConflictException('해당 메일로 가입된 계정이 존재합니다');

        const isDuplicatePhoneNumber = await this.userRepository.findByPhoneNumber(phoneNumber);
        if (isDuplicatePhoneNumber) throw new ConflictException('해당 번호로 가입된 계정이 존재합니다');

        const isDuplicateAccount = await this.userRepository.findByAccount(account);
        if (isDuplicateAccount) throw new ConflictException('이미 존재하는 아이디 입니다.');

        const isDuplicateNickName = await this.userRepository.findByNickName(nickName);
        if (isDuplicateNickName) throw new ConflictException('이미 존재하는 닉네임 입니다.');

        const salt = crypto.randomBytes(64).toString('base64');
        const hashedPassword = await this.hashPassword(password, salt);

        const user = new UserEntity({account, password: hashedPassword, salt, name, email, phoneNumber, nickName})

        await this.userRepository.save(user);
        this.infoLogger.info(`${account}, ${name}, ${nickName} 님이 가입하셨습니다.`)
        return
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return new Promise((resolve) => {
            crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, 'SHA512', (err, key) => {
                if (err) {
                    throw new InternalServerErrorException(err)
                }
                resolve(key.toString('base64'))
            });
        });
    }

    async signIn(signInRequestDto: SignInRequestDto): Promise<string> {
        const {account, password} = signInRequestDto;

        const user = await this.userRepository.findByAccount(account);
        if (!user) throw new BadRequestException('로그인에 실패하였습니다. 아이디와 비밀번호를 확인해주시길 바랍니다');

        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, user.salt, ITERATIONS, KEY_LENGTH, 'SHA512', async (err, buffer) => {
                const hashedPassword = buffer.toString('base64');
                (hashedPassword === user.password)
                    ? resolve(this.authService.signInWithJwt({userId: user.id}))
                    : reject(new BadRequestException('로그인에 실패하였습니다. 아이디와 비밀번호를 확인해주시길 바랍니다'));
                if (err) {
                    throw new InternalServerErrorException(err);
                }
            });
        });
    }

    async getUsers(): Promise<GetUsersResponseDto> {
        const users = await this.userRepository.findAll()
        return new GetUsersResponseDto(users);
    }

    async findOneById(userId: number) {
        const user = await this.userRepository.findOneById(userId);
        if (!user) throw new NotFoundException('해당 유저는 존재하지않습니다.');
        return new FindUserIdResponseDto(user);
    }
}
