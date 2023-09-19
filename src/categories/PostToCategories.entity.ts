import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {PostEntity} from "../posts/Post.entity";
import {CategoriesEntity} from "./Categories.entity";


@Entity('post_category')
export class PostToCategoriesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PostEntity, (post) => post.postToCategories)
    post: PostEntity;

    @ManyToOne(() => CategoriesEntity, (category) => category.postToCategories)
    category: CategoriesEntity;
}
