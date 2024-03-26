import {UploadRepository} from "./upload.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {UploadEntity} from "./upload.entity";
import {IsNull, Repository, UpdateResult} from "typeorm";

export class TypeormUploadRepository implements UploadRepository {
    constructor(
        @InjectRepository(UploadEntity)
        private readonly uploadRepository: Repository<UploadEntity>
    ) {
    }

    async findByNullPostId(): Promise<UploadEntity[]> {
        return await this.uploadRepository.find({
            where: {
                postId: IsNull()
            }
        })
    }

    async uploadFile(files: UploadEntity[]): Promise<UploadEntity[]> {
        return await this.uploadRepository.save(files);
    }

    async findOneByUrl(url: string): Promise<UploadEntity | null> {
        return await this.uploadRepository.findOne({where: {url: url}});
    }

    async matchToPostId(url: string, postId: number): Promise<UpdateResult> {
        return await this.uploadRepository.update({url: url}, {postId: postId})
    }

    async findOneById(imageId: number): Promise<UploadEntity | null> {
        return await this.uploadRepository.findOne({where: {id: imageId}})
    }

    async remove(image: UploadEntity): Promise<UploadEntity> {
        return await this.uploadRepository.remove(image);
    }
}