import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";

export const DUMMY_USER_RESOLVE = new UserEntity({
    account: "xptmxmlqslek123",
    password: "testpassword123",
    name: "홍길동",
    email: "test11r@example.com",
    phoneNumber: "01052828282",
    nickName: "빨리점11"
})

export const DUMMY_POST_RESOLVE = new PostEntity({
    title: '테스트 제목입니다.',
    content: '테스트 내용입니다.',
    cost: 10500,
    level: '고수'
})