import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airline } from './airline.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
  ) {}
  async findAll(): Promise<Airline[]> {
    return await this.airlineRepository.find({
      loadRelationIds: true,
    });
  }

  async findOne(id: string): Promise<Airline> {
    const airline: Airline = await this.airlineRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return airline;
  }

  async create(airline: Airline): Promise<Airline> {
    if (isValidDate(airline.startDate))
      throw new BusinessLogicException(
        'The airline start date must be less than actual date',
        BusinessError.BAD_REQUEST,
      );
    return await this.airlineRepository.save(airline);
  }

  async update(id: string, airline: Airline): Promise<Airline> {
    const persistedairline: Airline = await this.airlineRepository.findOne({
      where: { id },
    });
    if (!persistedairline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    if (isValidDate(airline.startDate))
      throw new BusinessLogicException(
        'The airline start date must be less than actual date',
        BusinessError.BAD_REQUEST,
      );
    return await this.airlineRepository.save({
      ...persistedairline,
      ...airline,
    });
  }

  async delete(id: string) {
    const airline: Airline = await this.airlineRepository.findOne({
      where: { id: id },
    });
    if (!airline)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.airlineRepository.remove(airline);
  }
}

function isValidDate(endDate: Date) {
  const date_ob = new Date();
  const end_date = new Date(endDate);
  date_ob.setDate(date_ob.getDate() - 1);
  return removeTime(end_date).getTime() >= removeTime(date_ob).getTime()
    ? true
    : false;
}
function removeTime(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
