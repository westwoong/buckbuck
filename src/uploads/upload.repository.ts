import {UploadEntity} from "./upload.entity";
import {UpdateResult} from "typeorm";

export interface UploadRepository {
    uploadFile(files: UploadEntity[]): Promise<UploadEntity[]>

    findOneByUrl(url: string): Promise<UploadEntity | null>

    matchToPostId(url: string, postId: number): Promise<UpdateResult>
}