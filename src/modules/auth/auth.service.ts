import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {randomInt} from "crypto";
import {Repository} from "typeorm";
import UserOtp from "../user/entity/otp.entity";
import User from "../user/entity/user.entity";
import SendOtpDto from "./dto/send-otp";

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserOtp) private otpRepo: Repository<UserOtp>,
    private jwtService: JwtService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const {mobile} = dto;
    const code = randomInt(10000, 99999).toString();
    const now = new Date();
    const expiresIn = new Date(now.getTime() + 1000 * 60);
    let user = await this.userRepo.findOneBy({mobile});
    if (!user) {
      user = this.userRepo.create({mobile, status: "active"});
      user = await this.userRepo.save(user);
    }
    if (user.status === "ban") {
      throw new ForbiddenException(
        "your account is banned please connect to support team using ticket system",
      );
    }
    let otp = await this.otpRepo.findOneBy({userId: user.id});
    if (!otp) {
      otp = this.otpRepo.create({
        userId: user.id,
      });
    }
    if (otp?.expiresIn > now) {
      throw new BadRequestException(
        "old otp not expires please try again later",
      );
    }
    if (otp.wrongCount >= 3) {
      throw new ForbiddenException(
        "you tried many times and your account is banned now please connect to support team using ticket system",
      );
    }
    otp.code = code;
    otp.expiresIn = expiresIn;
    otp = await this.otpRepo.save(otp);
    user.otpId = otp.id;
    await this.userRepo.save(user);
    const otpToken = this.jwtService.sign(
      {accountId: user.id},
      {expiresIn: "1m", secret: "otp-token-secret"},
    );
    return {
      otpToken,
    };
  }
}
