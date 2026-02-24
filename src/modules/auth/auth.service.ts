import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {randomInt, randomUUID} from "crypto";
import {Repository} from "typeorm";
import UserOtp from "../user/entity/otp.entity";
import User from "../user/entity/user.entity";
import CheckOtpDto from "./dto/check-otp.dtp";
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
  async checkOtp(checkOtpDto: CheckOtpDto) {
    const {code, token} = checkOtpDto;
    const accountId = this.verifyOtpToken(token, true);
    const user = await this.userRepo.findOneBy({id: accountId});
    if (!user) throw new NotFoundException();
    const otp = await this.otpRepo.findOneBy({
      userId: user.id,
    });
    if (!otp) throw new NotFoundException("not found otp");
    const now = new Date();
    if (otp.expiresIn < now) {
      throw new UnauthorizedException("otp expired");
    }
    if (otp.code !== code) {
      throw new UnauthorizedException("otp code wrong");
    }
    await this.userRepo.save(user);
    await this.otpRepo.save(otp);
    const {accessToken, refreshToken, tokenId} = this.clientTokenGenerator(
      user.id,
    );
    return {
      message: "login successfully",
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
  verifyOtpToken(token: string, client: boolean = false) {
    try {
      let secret = "otp-token-secret";
      const decoded = this.jwtService.verify(token, {
        secret,
      });
      if (decoded?.accountId) return decoded.accountId;
      throw new BadRequestException("invalid token");
    } catch (error) {
      throw new BadRequestException("otp expired!");
    }
  }
  clientTokenGenerator(accountId: number) {
    const accessToken = this.jwtService.sign(
      {accountId},
      {secret: "access-secret", expiresIn: "5m"},
    );
    const tokenId = randomUUID();
    const refreshToken = this.jwtService.sign(
      {accountId, id: tokenId},
      {secret: "refresh-token", expiresIn: "30d"},
    );
    return {
      accessToken,
      refreshToken,
      tokenId,
    };
  }
  async verifyAccessToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: "access-secret",
      });
      if (decoded?.accountId) {
        const user = await this.userRepo.findOne({
          where: {id: decoded.accountId},
        });
        return {
          id: user.id,
          image: user?.image,
          firstname: user?.firstname,
          lastname: user?.lastname,
          mobile: user.mobile,
          status: user?.status,
        };
      }
      throw new UnauthorizedException("invalid token");
    } catch (error) {
      throw new UnauthorizedException("login again");
    }
  }
}
