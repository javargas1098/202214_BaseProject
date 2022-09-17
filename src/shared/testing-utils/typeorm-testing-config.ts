/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from '../../airline/airline.entity';
import { Airport } from '../../airport/airport.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      Airline,
      Airport
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    Airline,
    Airport
  ]),
];
