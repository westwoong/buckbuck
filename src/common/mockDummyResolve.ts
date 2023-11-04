import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";
import {CommentEntity} from "../comments/Comment.entity";
import {ReviewEntity} from "../reviews/Review.entity";

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

export const DUMMY_COMMENT_RESOLVE = new CommentEntity({
    content: '테스트 댓글 달아봅니다.',
    proposalCost: 15000
})

export const DUMMY_REVIEW_RESOLVE = new ReviewEntity({
    post: DUMMY_POST_RESOLVE,
    stars: 5,
    comment: '친절해요'
})