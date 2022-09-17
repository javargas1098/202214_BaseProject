import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { Airport } from './airport.entity';
import { AirportService } from './airport.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<Airport>;
  let airportList: Airport[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<Airport>>(getRepositoryToken(Airport));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    airportList = [];
    for (let i = 0; i < 5; i++) {
      const airport = new Airport();
      airport.name = faker.word.adjective();
      airport.code = 'cod';
      airport.country = faker.word.adjective();
      airport.city = faker.word.adjective();
      await repository.save(airport);
      airportList.push(airport);
    }
  };
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll should return all airports', async () => {
    const airport: Airport[] = await service.findAll();
    expect(airport).not.toBeNull();
    expect(airport).toHaveLength(airportList.length);
  });

  it('findOne should return a airport by id', async () => {
    const storedAirline: Airport = airportList[0];
    const airport: Airport = await service.findOne(storedAirline.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirline.name);
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('create should return a new airport', async () => {
    const airport: Airport = {
      id: '',
      name: faker.word.adjective(),
      code: 'cod',
      city: faker.word.adjective(),
      country: faker.word.adjective(),
      airlines: [],
    };
    const newRestaurant: Airport = await service.create(airport);
    expect(newRestaurant).not.toBeNull();

    const storedAirline: Airport = await repository.findOne({
      where: { id: newRestaurant.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(newRestaurant.name);
  });
  it('create throw an exception for invalid code', async () => {
    const airport: Airport = {
      id: '',
      name: faker.word.adjective(),
      code: 'code',
      city: faker.word.adjective(),
      country: faker.word.adjective(),
      airlines: [],
    };
    await expect(() => service.create(airport)).rejects.toHaveProperty(
      'message',
      'The airport code must be less that 3 characters',
    );
  });

  it('update should modify a airport', async () => {
    const airport: Airport = airportList[0];
    airport.name = 'New name';
    const updatedRestaurant: Airport = await service.update(
      airport.id,
      airport,
    );
    expect(updatedRestaurant).not.toBeNull();
    const storedAirline: Airport = await repository.findOne({
      where: { id: airport.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airport.name);
  });

  it('update should throw an exception for an invalid airport', async () => {
    let airport: Airport = airportList[0];
    airport = {
      ...airport,
      name: 'New name',
    };
    await expect(() => service.update('0', airport)).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid code', async () => {
    let airport: Airport = airportList[0];
    airport = {
      ...airport,
      name: 'New name',
      code: 'code',
    };
    await expect(() =>
      service.update(airport.id, airport),
    ).rejects.toHaveProperty(
      'message',
      'The airport code must be less that 3 characters',
    );
  });

  it('delete should remove a airport', async () => {
    const airport: Airport = airportList[0];
    await service.delete(airport.id);
    const deleteRestaurant: Airport = await repository.findOne({
      where: { id: airport.id },
    });
    expect(deleteRestaurant).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    const airport: Airport = airportList[0];
    await service.delete(airport.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });
});
