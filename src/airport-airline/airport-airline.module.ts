import { Module } from '@nestjs/common';
import { AirportAirlineService } from './airport-airline.service';
import { AirportAirlineController } from './airport-airline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from '../airline/airline.entity';
import { Airport } from '../airport/airport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airline, Airport])],
  providers: [AirportAirlineService],
  controllers: [AirportAirlineController],
})
export class AirportAirlineModule {}
