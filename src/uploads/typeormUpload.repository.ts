import {UploadRepository} from "./upload.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {UploadEntity} from "./upload.entity";
import {Repository} from "typeorm";

export class TypeormUploadRepository implements UploadRepository {
    constructor(
        @InjectRepository(UploadEntity)
        private readonly uploadRepository: Repository<UploadEntity>
    ) {
    }
    async fileUpload(): Promise<UploadEntity[]> {
        return Promise.resolve([]);
    }

}