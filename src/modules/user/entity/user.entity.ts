import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import UserOtp from "./otp.entity";

@Entity()
export default class User {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({nullable: true})
  firstname: string;
  @Column({nullable: true})
  lastname: string;
  @Column()
  @Index({unique: true})
  mobile: string;
  @Column({nullable: true})
  image: string;
  @Column({nullable: true})
  age: string;
  @Column({nullable: true})
  province: string;
  @Column({nullable: true})
  city: string;
  @Column({type: "enum", enum: ["active", "ban"], default: "active"})
  status: string;
  @Column({nullable: true})
  banReason: string;
  @Column({nullable: true})
  otpId: number;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @OneToOne(() => UserOtp, (otp) => otp.user, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  otp: UserOtp;
}
