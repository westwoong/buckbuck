import {UserEntity} from "../users/User.entity";
import {PostEntity} from "../posts/Post.entity";
import {CommentEntity} from "../comments/Comment.entity";
import {ReviewEntity} from "../reviews/Review.entity";
import {CategoriesEntity} from "../categories/Categories.entity";

export const DUMMY_USER_RESOLVE = new UserEntity({
    account: "xptmxmlqslek123",
    password: "testpassword123",
    salt: "testPasswordSalt",
    name: "홍길동",
    email: "test11r@example.com",
    phoneNumber: "01052828282",
    nickName: "빨리점11"
})

export const DUMMY_CATEGORY_RESOLVE = new CategoriesEntity({
    name: '테스트카테고리'
})

export const DUMMY_POST_RESOLVE = new PostEntity({
    title: '테스트 제목입니다.',
    content: '테스트 내용입니다.',
    cost: 10500,
    level: '고수',
    userId: 8282
})

export const DUMMY_COMMENT_RESOLVE = new CommentEntity({
    content: '테스트 댓글 달아봅니다.',
    proposalCost: 15000,
    userId: 8282,
    postId: 1111
})

export const DUMMY_REVIEW_RESOLVE = new ReviewEntity({
    postId: 1,
    stars: 5,
    comment: '친절해요',
    requesterId: 55,
    performerId: 66,
})