import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Showtime from "./showtime.entity";
import Venue from "./venue.entity";

@Entity()
export default class Hall {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column({type: "int", unsigned: true})
  capacity: number;
  @Column()
  venueId: number;
  @ManyToOne(() => Venue, (venue) => venue.halls, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  venue: Venue;
  @OneToMany(() => Showtime, (showtime) => showtime.event)
  showtimes: Showtime[];
}
