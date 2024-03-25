import {UploadEntity} from "./upload.entity";
import {UpdateResult} from "typeorm";

export interface UploadRepository {
    findByNullPostId(): Promise<UploadEntity[]>

    uploadFile(files: UploadEntity[]): Promise<UploadEntity[]>

    findOneByUrl(url: string): Promise<UploadEntity | null>

    findOneById(imageId: number): Promise<UploadEntity | null>

    matchToPostId(url: string, postId: number): Promise<UpdateResult>

    remove(image: UploadEntity): Promise<UploadEntity>
}