import {SignUpRequestDto} from "../dto/signUp.request.dto";
import {validate} from "class-validator";

describe('SignUpRequestDto', () => {
    describe('회원가입 아이디 관련 테스트', () => {
        describe('account 필드 validator 테스트 성공 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['xptmxmlqslek123'],
                ['ghdrlfehd5858'],
                ['8080275aa'],
            ])('회원가입 아이디의 값이 정상일 시 error 의 길이가 0이여야한다', async (account) => {
                signUpDto.account = account;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).toHaveLength(0);
            });
        })

        describe('account 필드 validator 테스트 실패 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                [''], //공백 검사
                ['XPTMXMDLQSLEK123'],       // 대문자 검사
                ['xptmxmdlqslek!@#'],       // 특수문자 검사
                ['tt1'], // 길이 미달 검사
                ['xptmxmdxpmxpxmpxmpxmpxmlqslek!@#'], // 길이 초과 검사
            ])('회원가입 아이디가 규격에 맞지 않을 시 에러가 발생한다.', async (account) => {
                signUpDto.account = account;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).not.toHaveLength(0);
            });
        });
    })

    describe('회원가입 비밀번호 관련 테스트', () => {
        describe('password 필드 validator 테스트 성공 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['testpassword123'],
                ['qlalfqjsgh5758'],
                ['qwer132qwer']
            ])('password 값이 정상일 시 error의 길이가 0이여야한다.', async (password) => {
                signUpDto.password = password;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).toHaveLength(0);
            });
        })

        describe('password 필드 validator 테스트 실패 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                [''], // 비밀번호 미입력
                ['test password 123'], // 비밀번호 공백 포함
                ['pw1234'], // 비밀번호 길이 미달
                ['thisPasswordLengthToLong!#@12312'], // 비밀번호 길이 초과
            ])('회원가입 비밀번호가 규격에 맞지 않을 시 에러가 발생한다.', async (password) => {
                signUpDto.password = password;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).not.toHaveLength(0);
            });
        });
    })

    describe('회원가입 이름 관련 테스트', () => {
        describe('name 필드 validator 테스트 성공 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['홍길동'], // 정상 이름
                ['김철수'],
                ['김유미']
            ])('회원가입 이름의 값이 정상일 시 error 의 길이가 0이여야한다', async (name) => {
                signUpDto.name = name;
                const errors = await validate(signUpDto, {skipMissingProperties: true});
                expect(errors).toHaveLength(0);
            });
        })

        describe('name 필드 validator 테스트 실패 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['', false], // 이름이 공백
                ['jonson', false], // 영문 이름
                ['웅', false], // 이름 길이 미달
                ['김수한무거북이와두루미삼천갑자', false], // 이름 길이 초과
            ])('회원가입 이름이 validator 에 위반될 시 에러를 반환한다.', async (name) => {
                signUpDto.name = name;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).not.toHaveLength(0);
            });
        })
    })

    describe('회원가입 이메일 관련 테스트', () => {
        describe('email 필드 validator 테스트 성공 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['test11r@example.com'], // 정상 이메일
                ['ace1324@naver.com'],
                ['qwer1157@yahoo.co.kr']
            ])('회원가입 이메일 정상적일 시 error 의 길이가 0이여야한다.', async (email) => {
                signUpDto.email = email;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).toHaveLength(0);
            });
        })

        describe('email 필드 validator 테스트 실패 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                [''], // 빈 값일 시
                ['test 11r@example.com', false], // 공백 포함 시
                ['test11rexample.com', false], // @ 미포함 시
                ['test11r@.com', false], // 도메인 미포함 시
                ['test11r@example', false], // 최상위 도메인 미포함 시
            ])('회원가입 이메일 값이 유효하지않을 시 에러를 반환한다.', async (email) => {
                signUpDto.email = email;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).not.toHaveLength(0);
            });
        })
    })

    describe('회원가입 핸드폰번호 관련 테스트', () => {
        describe('phoneNumber 필드 validator 테스트 성공 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['01052828282'], // 정상적인 번호
                ['01012345678'],
                ['01011233433']
            ])('010을 포함한 휴대폰번호만 입력 시 error 의 길이가 0이여야한다.', async (phoneNumber) => {
                signUpDto.phoneNumber = phoneNumber;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).toHaveLength(0);
            })
        })

        describe('phoneNumber 필드 validator 테스트 실패 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['010-5282-8282'], // 하이픈 포함
                ['52828282'], // 010 미포함(길이미달)
                ['01185858585'], // 010으로 시작을 안할 시
                ['010 5282 8282'], // 공백 포함 시
                ['010528282821'], // 길이 초과 시
                ['공일공52828282'], // 숫자 외 문자 포함 시
            ])('휴대폰 번호에 숫자를 제외한 값을 입력시 에러를 반환한다', async (phoneNumber) => {
                signUpDto.phoneNumber = phoneNumber;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).not.toHaveLength(0);
            });
        })
    })

    describe('회원가입 닉네임 관련 테스트', () => {
        describe('nickName 필드 validator 테스트 성공 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                ['빨리점11'], // 정상적인 닉네임
                ['나는다해줘'],
                ['왕입니다']
            ])('회원가입 닉네임의 값이 정상일 시 error 의 길이가 0이여야한다', async (nickName) => {
                signUpDto.nickName = nickName;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).toHaveLength(0);
            });
        })

        describe('nickName 필드 validator 테스트 실패 검사', () => {
            const signUpDto = new SignUpRequestDto();
            it.each([
                [''], // 공백인 경우
                ['_빨리점_'], // 특수문자가 포함된 경우
                ['왕'], // 길이 미달
                ['빨리빨리빨리좀제발빨리좀'], // 길이 초과
            ])('회원가입 닉네임의 값이 validator 에 위반될 시 에러가 발생한다.', async (nickName) => {
                signUpDto.nickName = nickName;
                const errors = await validate(signUpDto, {skipMissingProperties: true});

                expect(errors).not.toHaveLength(0);
            });
        })
    })
})