import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Event from "./event.entity";
import Hall from "./hall.entity";

@Entity()
export default class Showtime {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  eventId: number;
  @Column()
  hallId: number;
  @Column({type: "timestamp"})
  startTime: Date;
  @Column({type: "timestamp"})
  endTime: Date;
  @Column({type: "int", unsigned: true, nullable: true})
  capacity: number;
  @Column({type: "int", unsigned: true, default: 0})
  soldCount: number;
  @Column({type: "int", unsigned: true, nullable: true})
  price: number;
  @ManyToOne(() => Event, (event) => event.showtimes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  event: Event;
  @ManyToOne(() => Hall, (hall) => hall.showtimes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  hall: Hall;
}
