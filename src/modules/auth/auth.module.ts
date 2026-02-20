import {Module} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import UserOtp from "../user/entity/otp.entity";
import User from "../user/entity/user.entity";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserOtp])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [],
})
export default class AuthModule {}
