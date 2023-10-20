import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoriesEntity} from "./Categories.entity";
import {PostToCategoriesEntity} from "./PostToCategories.entity";
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import {TypeormCategoryRepository} from "./typeormCategory.repository";
import {CATEGORY_REPOSITORY} from "../common/injectToken.constant";

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesEntity, PostToCategoriesEntity])],
    controllers: [CategoriesController],
    providers: [
        CategoriesService,
        {
            provide: CATEGORY_REPOSITORY, useClass: TypeormCategoryRepository
        }
    ],
})
export class CategoriesModule {
}
