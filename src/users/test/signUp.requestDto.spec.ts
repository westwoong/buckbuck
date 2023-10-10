import {SignUpRequestDto} from "../dto/signUp.request.dto";
import {validate} from "class-validator";

describe('SignUpRequestDto', () => {
    describe('회원가입 유효성 검사', () => {
        describe('account 유효성 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['xptmxmlqslek123', true], // 검사 통과 정상 아이디 값
                ['', false], // 아이디 미입력 검사
                ['XPTMXMDLQSLEK123', false],       // 대문자 검사
                ['xptmxmdlqslek!@#', false],       // 특수문자 검사
                ['tt1', false], // 길이 미달 검사
                ['xptmxmdxpmxpxmpxmpxmpxmlqslek!@#', false], // 길이 초과 검사

            ])('account 값이 유효하지않을 시 에러를 반환한다', async (account, isValid) => {
                signUpDto.account = account;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                if (isValid) expect(errors).toHaveLength(0);
                if (!isValid) expect(errors).not.toHaveLength(0);
            });
        });

        describe('password 유효성 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['testpassword123', true], // 정상 패스워드값
                ['test password 123', false], // 비밀번호 공백 포함
                ['pw1234', false], // 비밀번호 길이 미달
                ['thisPasswordLengthToLong!#@12312', false], // 비밀번호 길이 초과
            ])('password 값이 유효하지않을 시 에러를 반환한다', async (password, isValid) => {
                signUpDto.password = password;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                if (isValid) expect(errors).toHaveLength(0);
                if (!isValid) expect(errors).not.toHaveLength(0);
            });
        });

        describe('name 유효성 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['김돌쇠', true], // 정상 이름
                ['', false], // 이름이 공백
                ['jonson', false], // 영문 이름
                ['웅', false], // 이름 길이 미달
                ['김수한무거북이와두루미삼천갑자', false], // 이름 길이 초과
            ])('name 값이 유효하지않을 시 에러를 반환한다', async (name, isValid) => {
                signUpDto.name = name;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                if (isValid) expect(errors).toHaveLength(0);
                if (!isValid) expect(errors).not.toHaveLength(0);
            });
        });

        describe('email 유효성 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['test11r@example.com', true], // 정상 이메일
                ['test 11r@example.com', false], // 공백 포함 시
                ['test11rexample.com', false], // @ 미포함 시
                ['test11r@.com', false], // 도메인 미포함 시
                ['test11r@example', false], // 최상위 도메인 미포함 시
            ])('email 값이 유효하지않을 시 에러를 반환한다', async (email, isValid) => {
                signUpDto.email = email;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                if (isValid) expect(errors).toHaveLength(0);
                if (!isValid) expect(errors).not.toHaveLength(0);
            });
        });

        describe('phoneNumber 유효성 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['01052828282', true], // 정상적인 번호
                ['010-5282-8282', false], // 하이픈 포함
                ['52828282', false], // 010 미포함(길이미달)
                ['010 5282 8282', false], // 공백 포함 시
                ['010528282821', false], // 길이 초과 시
                ['공일공52828282', false], // 숫자 외 문자 포함 시
            ])('phoneNumber 값이 유효하지않을 시 에러를 반환한다', async (phoneNumber, isValid) => {
                signUpDto.phoneNumber = phoneNumber;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                if (isValid) expect(errors).toHaveLength(0);
                if (!isValid) expect(errors).not.toHaveLength(0);
            });
        });

        describe('nickName 유효성 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['빨리점11', true], // 정상적인 닉네임
                ['', false], // 공백인 경우
                ['_빨리점_', false], // 특수문자가 포함된 경우
                ['왕', false], // 길이 미달
                ['빨리빨리빨리좀제발빨리좀', false], // 길이 초과
            ])('nickName 값이 유효하지않을 시 에러를 반환한다', async (nickName, isValid) => {
                signUpDto.nickName = nickName;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                if (isValid) expect(errors).toHaveLength(0);
                if (!isValid) expect(errors).not.toHaveLength(0);
            });
        });
    })
})