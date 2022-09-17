import { Airline } from '../airline/airline.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Airport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @ManyToMany(() => Airline, (airline) => airline.airports)
  airlines: Airline[];
}
