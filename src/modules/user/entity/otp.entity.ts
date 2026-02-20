import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./user.entity";

@Entity()
export default class UserOtp {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  code: string;
  @Column({type: "timestamp"})
  expiresIn: Date;
  @Column({default: 0})
  wrongCount: number;
  @Column()
  userId: number;
  @OneToOne(() => User, (user) => user.otp, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user: User;
}
