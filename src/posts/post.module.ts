import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./Post.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity])]
})
export class PostModule {
}
