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

    async uploadFile(files: UploadEntity[]): Promise<UploadEntity[]> {
        return await this.uploadRepository.save(files);
    }

    async findOneByUrl(url: string): Promise<UploadEntity | null> {
        return await this.uploadRepository.findOne({where: {url: url}});
    }
}