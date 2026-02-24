import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {OrderStatus} from "../enum/status.enum";

@Entity()
export default class Order {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  userId: number;
  @Column()
  showtimeId: number;
  @Column({type: "int", unsigned: true})
  quantity: number;
  @Column({type: "int", unsigned: true})
  totalPrice: number;
  @Column({type: "enum", enum: OrderStatus, default: OrderStatus.PENDING})
  status: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
