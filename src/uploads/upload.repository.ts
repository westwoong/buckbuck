import {UploadEntity} from "./upload.entity";

export interface UploadRepository {
    uploadFile(files: UploadEntity[]): Promise<UploadEntity[]>

    findOneByUrl(url: string): Promise<UploadEntity | null>
}