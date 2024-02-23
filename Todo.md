## 처리 중
- 각 Controller 에서 RequestDto 필요한 부분 추가하기 (~~Body~~, Query, ~~Param~~ 검증용 Validator 추가하기)
  - **각 API Body RequestDTO 처리 완료**
  - **param requestDto** 비효율 적이라고 판단되어 제거(롤백) 
  - pagiNation 용 page Query parameter RequestDto 추가하기
    - 추가 이유 (컨트롤러 단 null 값 방지를 추가하여 서비스에서 논리연산 제거하기)

## 처리 완료
- GET /users API (테스트 O)
- GET /comments/:commentId
- GET /posts?page=N
- GET /comments/post/:postId
- JWT Guard(인가) 적용하기
  - 적용 시 하드코딩되어있는 userId 부분 수정하기
- 각 API ResponseDto 추가하기
- 
## TODO
- 각 API 유효성 검증 분리하기
- 이메일 본인인증 기능 추가
- UserEntity 포인트 제도로 변경하기
- postsService getPosts() Test 부분 ts-ignore 지울방법 생각해보기 (타입 명시)