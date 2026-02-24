import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Hall from "./hall.entity";

@Entity()
export default class Venue {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column({nullable: true})
  description: string;
  @Column({nullable: true})
  address: string;
  @OneToMany(() => Hall, (hall) => hall.venue)
  halls: Hall[];
}
