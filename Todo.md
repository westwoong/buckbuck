## 처리 중
- postId 매칭 로직 구현 - 이미지 선 업로드 후 postId 갱신 or 트랜잭션활용 동시(게시글&이미지) 업로드 필요
- 이미지 업로드 validator (mimetype, size limit, max files)
- /upload 컨트롤러 RequestDTO, ResponseDTO
- upload 테스트 작성 (multer-s3 mock)
- 버킷 분리 (Dev, Prod)
- /upload API 문서화
- 프론트 페이지 연결

## 처리 완료
- Github Actions Docker 배포 적용
  - 테스트 성공 시에만 배포, 실패 시 slack 웹훅
- GET /users API (테스트 O)
- GET /comments/:commentId
- GET /posts?page=N
- GET /comments/post/:postId
- JWT Guard(인가) 적용하기
  - 적용 시 하드코딩되어있는 userId 부분 수정하기
- 각 API ResponseDto 추가하기
- ~~각 Controller 에서 RequestDto 필요한 부분 추가하기 (~~Body~~, Query, ~~Param~~ 검증용 Validator 추가하기)~~
  - RequestDto 대신 Pipe 적용
- Swagger 문서화 하기
  - requestDTO 추가하기
  - responseDTO 추가하기
- 파일 업로드 기능 추가하기 (gif, jpg, jpeg, png)

## TODO
- Logging 적용하기
  - 운영서버일 때만 로깅해야함, 로컬에선 off
- 부하테스트 해보기 (Web, DB)
- Index 적용하기
- 이메일 본인인증 기능 추가 (SMTP 필요 - 직접 구축 할지 외부메일로 할지 고민)
- ~~UserEntity 포인트 제도로 변경하기~~ (고민 해보기)
- postsService getPosts() Test 부분 ts-ignore 지울방법 생각해보기 (타입 명시)