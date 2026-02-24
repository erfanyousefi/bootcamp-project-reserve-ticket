import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Ticket {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  orderId: number;
  @Column()
  capacityId: number;
  @Column({type: "int", unsigned: true})
  price: number;
  @Column({type: "varchar", length: 30})
  @Index({unique: true})
  code: string;
}
