import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import * as process from 'process';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: 3306,
          entities: ["dist/**/*.entity.js"],
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          // autoLoadEntities: true,
          synchronize: process.env.SERVER === 'local',
          logging: process.env.SERVER === 'local',
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('옵션 설정 에러');
        }
        console.log(options);
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
})
export class ORMModule {}
