import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {CapacityStatus} from "../enum/status.enum";

@Entity()
export default class Capacity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({nullable: true})
  chairNo: string;
  @Column({nullable: true})
  price: number;
  @Column()
  showtimeId: number;
  @Column({
    type: "enum",
    enum: CapacityStatus,
    default: CapacityStatus.AVAILABLE,
  })
  status: CapacityStatus;
}
