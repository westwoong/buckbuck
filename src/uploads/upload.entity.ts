import {Column, Entity, ManyToOne, RelationId} from "typeorm";
import {DefaultEntityColumn} from "../config/default.entity";
import {PostEntity} from "../posts/Post.entity";
import {UserEntity} from "../users/User.entity";

interface IUploadConstructor {
    url: string;
    sequence: number;
    userId: number;
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
    @RelationId((upload: UploadEntity) => upload.post)
    postId: number;

    @ManyToOne(() => UserEntity, (user) => user.image, {nullable: false})
    user: UserEntity;

    @Column({nullable: false})
    @RelationId((upload: UploadEntity) => upload.user)
    userId: number;

    constructor(upload: IUploadConstructor) {
        super();
        if (upload) {
            this.url = upload.url;
            this.sequence = upload.sequence;
            this.userId = upload.userId;
        }
    }
}