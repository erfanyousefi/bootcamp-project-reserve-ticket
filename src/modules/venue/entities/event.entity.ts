import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Showtime from "./showtime.entity";

@Entity()
export default class Event {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column({nullable: true})
  description: string;
  @Column({type: "enum", enum: ["concert", "cinema"]})
  type: string;
  @Column({type: "int", unsigned: true, nullable: true})
  durationMinutes: number;
  @OneToMany(() => Showtime, (showtime) => showtime.event)
  showtimes: Showtime[];
}
