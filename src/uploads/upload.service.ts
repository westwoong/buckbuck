import {Inject, Injectable} from "@nestjs/common";
import {POST_REPOSITORY, UPLOAD_REPOSITORY} from "../common/injectToken.constant";
import {UploadRepository} from "./upload.repository";
import {PostRepository} from "../posts/post.repository";

@Injectable()
export class UploadService {
    constructor(
        @Inject(UPLOAD_REPOSITORY)
        private readonly uploadRepository: UploadRepository,
        @Inject(POST_REPOSITORY)
        private readonly postRepository: PostRepository
    ) {
    }
}