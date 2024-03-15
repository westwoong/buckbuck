import {UploadEntity} from "./upload.entity";

export interface UploadRepository {
    fileUpload(): Promise<UploadEntity[]>
}