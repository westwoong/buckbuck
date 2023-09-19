import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoriesEntity} from "./Categories.entity";
import {PostToCategoriesEntity} from "./PostToCategories.entity";
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesEntity, PostToCategoriesEntity])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule {
}
