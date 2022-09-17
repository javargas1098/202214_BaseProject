import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { Airport } from './airport.entity';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
  ) {}
  async findAll(): Promise<Airport[]> {
    return await this.airportRepository.find({
      loadRelationIds: true,
    });
  }

  async findOne(id: string): Promise<Airport> {
    const airport: Airport = await this.airportRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return airport;
  }

  async create(airport: Airport): Promise<Airport> {
    if (validateCode(airport.code))
      throw new BusinessLogicException(
        'The airport code must be less that 3 characters',
        BusinessError.BAD_REQUEST,
      );
    return await this.airportRepository.save(airport);
  }

  async update(id: string, airport: Airport): Promise<Airport> {
    const persistedairline: Airport = await this.airportRepository.findOne({
      where: { id },
    });
    if (!persistedairline)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (validateCode(airport.code))
      throw new BusinessLogicException(
        'The airport code must be less that 3 characters',
        BusinessError.BAD_REQUEST,
      );
    return await this.airportRepository.save({
      ...persistedairline,
      ...airport,
    });
  }

  async delete(id: string) {
    const airport: Airport = await this.airportRepository.findOne({
      where: { id },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.airportRepository.remove(airport);
  }
}
function validateCode(code: string) {
  return code.length > 3 ? true : false;
}
