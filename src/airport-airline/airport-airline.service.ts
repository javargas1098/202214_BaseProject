import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Airline } from '../airline/airline.entity';
import { AirportDto } from '../airport/airport.dto';
import { Airport } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';
import { AirportAirlineDto } from './airport-airline.dto';

@Injectable()
export class AirportAirlineService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,

    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
  ) {}
  async addAirportToAirline(
    airlineId: string,
    airportId: string,
  ): Promise<Airline> {
    const airline: Airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airport: Airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    airline.airports = [...airline.airports, airport];
    return await this.airlineRepository.save(airline);
  }

  async findAirportsFromAirline(airlineId: string): Promise<Airport[]> {
    const airline: Airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return airline.airports;
  }

  async findAirportFromAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirportDto> {
    const airline: Airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airport: Airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const airportAirline = airline.airports.find((e) => e.id === airport.id);

    if (!airportAirline)
      throw new BusinessLogicException(
        'The airport with the given id is not associated to the airline',
        BusinessError.PRECONDITION_FAILED,
      );

    return airportAirline;
  }
  async updateAirportsFromAirline(
    airlineId: string,
    airports: AirportAirlineDto[],
  ): Promise<Airline[]> {
    const airline: Airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const updatedAirports: Airline[] = [];

    for (const airportEntity of airports) {
      const airport: Airport = await this.airportRepository.findOne({
        where: { id: airportEntity.id },
      });
      if (!airport)
        throw new BusinessLogicException(
          'The airport with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      airline.airports = [...airline.airports, airport];
      updatedAirports.push(await this.airlineRepository.save(airline));
    }

    return updatedAirports;
  }

  async deleteAirportFromAirline(airlineId: string, airportId: string) {
    const airline: Airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airport: Airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airportAirline = airline.airports.find((e) => e.id === airport.id);

    if (!airportAirline)
      throw new BusinessLogicException(
        'The airport with the given id is not associated to the airline',
        BusinessError.PRECONDITION_FAILED,
      );

    airline.airports = airline.airports.filter((e) => e.id !== airportId);
    await this.airlineRepository.save(airline);
  }
}
