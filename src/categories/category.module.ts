import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoriesEntity} from "./Categories.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesEntity])],
})
export class CategoryModule {
}
