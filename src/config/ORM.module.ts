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
          host: '54.180.107.141',
          port: 3306,
          username: 'root',
          password: 'testpassword123',
          database: 'test',
          autoLoadEntities: true,
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
