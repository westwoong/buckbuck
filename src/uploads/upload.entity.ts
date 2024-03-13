import {Column, Entity, ManyToOne, RelationId} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {PostEntity} from "../posts/Post.entity";

interface IUploadConstructor {
    url: string;
    sequence: number;
    postId: number;
}

@Entity('images')
export class UploadEntity extends DefaultEntityColumn {
    @Column()
    url: string;

    @Column()
    sequence: number;

    @ManyToOne(() => PostEntity, (post) => post.uploadFile, {nullable: false})
    post: PostEntity;

    @Column()
    @RelationId((file: UploadEntity) => file.post)
    postId: number;

    constructor(file: IUploadConstructor) {
        super();
        if (file) {
            this.url = file.url;
            this.sequence = file.sequence;
            this.postId = file.postId;
        }
    }
}