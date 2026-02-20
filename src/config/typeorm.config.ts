import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  username: 'root',
  password: 'root',
  port: 3306,
  host: 'localhost',
  synchronize: true,
  database: 'reserve',
  autoLoadEntities: true,
  entities: [],
};
export default TypeOrmConfig;
