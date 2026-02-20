import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import UserOtp from "./entity/otp.entity";
import User from "./entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserOtp])],
})
export default class UserModule {}
