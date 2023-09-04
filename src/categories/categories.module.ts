import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoriesEntity} from "./Categories.entity";
import {PostToCategoriesEntity} from "./PostToCategories.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesEntity, PostToCategoriesEntity])],
})
export class CategoriesModule {
}
