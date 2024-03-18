import {Column, Entity, ManyToOne, RelationId} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {PostEntity} from "../posts/Post.entity";

interface IUploadConstructor {
    url: string;
    sequence: number;
}

@Entity('images')
export class UploadEntity extends DefaultEntityColumn {
    @Column({nullable: false})
    url: string;

    @Column({nullable: false})
    sequence: number;

    @ManyToOne(() => PostEntity, (post) => post.uploadFile)
    post: PostEntity;

    @Column({nullable: true})
    @RelationId((file: UploadEntity) => file.post)
    postId: number;

    constructor(file: IUploadConstructor) {
        super();
        if (file) {
            this.url = file.url;
            this.sequence = file.sequence;
        }
    }
}