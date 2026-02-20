import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import TypeOrmConfig from "./config/typeorm.config";
import AuthModule from "./modules/auth/auth.module";
import UserModule from "./modules/user/user.module";

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
