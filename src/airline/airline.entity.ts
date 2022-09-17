import { Airport } from '../airport/airport.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Airline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  pageUrl: string;

  @ManyToMany(() => Airport, (airport) => airport.airlines)
  @JoinTable()
  airports: Airport[];
}
