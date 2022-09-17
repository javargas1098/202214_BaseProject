import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Airline } from '../airline/airline.entity';
import { Airport } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { AirportAirlineService } from './airport-airline.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirportDto } from 'src/airport/airport.dto';
import { AirportAirlineDto } from './airport-airline.dto';

describe('AirportAirlineService', () => {
  let service: AirportAirlineService;
  let repository: Repository<Airline>;
  let airportRepository: Repository<Airport>;
  let airline: Airline;
  let airportList: Airport[];
  let airportAirlineList: AirportAirlineDto[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportAirlineService],
    }).compile();

    service = module.get<AirportAirlineService>(AirportAirlineService);
    repository = module.get<Repository<Airline>>(getRepositoryToken(Airline));
    airportRepository = module.get<Repository<Airport>>(
      getRepositoryToken(Airport),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportRepository.clear();
    airportList = [];
    airportAirlineList = [];
    for (let i = 0; i < 3; i++) {
      const airport = new Airport();
      airport.name = faker.word.adjective();
      airport.code = faker.word.adjective();
      airport.city = faker.word.adjective();
      airport.country = faker.word.adjective();
      await airportRepository.save(airport);
      airportList.push(airport);
      airportAirlineList.push({
        id: airport.id,
      } as AirportAirlineDto);
    }

    airline = await repository.save({
      name: faker.word.adjective(),
      description: faker.word.adjective(),
      startDate: '2022-09-11',
      pageUrl: 'www.test.com',
      airports: airportList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('addAirportToAirline should add an Airport to a Airline', async () => {
    const airport: Airport = airportList[0];

    const updatedAirport = await service.addAirportToAirline(
      airline.id,
      airport.id,
    );
    expect(updatedAirport.airports.length).toBe(4);

    expect(updatedAirport).not.toBeNull();
    expect(updatedAirport.airports[3].name).toBe(airport.name);
  });
  it('addAirportToAirline should thrown exception for an invalid airline', async () => {
    const airport: Airport = airportList[0];

    await expect(() =>
      service.addAirportToAirline('0', airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
  it('findAirportsFromAirline should return Airports by Airline', async () => {
    const storedAirport: Airport[] = await service.findAirportsFromAirline(
      airline.id,
    );
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.length).toBe(airportList.length);
  });
  it('findAirportsFromAirline should throw an exception for an invalid Airline', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
  it('findAirportFromAirline should return Airport by Airline', async () => {
    const airport: Airport = airportList[0];
    const storedAirport: AirportDto = await service.findAirportFromAirline(
      airline.id,
      airport.id,
    );
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toBe(airport.name);
  });
  it('findAirportFromAirline should throw an exception for an invalid Airline', async () => {
    const airport: Airport = airportList[0];
    await expect(() =>
      service.findAirportFromAirline('0', airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
  it('findAirportFromAirline should throw an exception for an invalid Airport', async () => {
    await expect(() =>
      service.findAirportFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });
  it('findAirportFromAirline should throw an exception for an invalid Airport and Airline', async () => {
    const airport = await airportRepository.save({
      name: faker.word.adjective(),
      code: faker.word.adjective(),
      city: faker.word.adjective(),
      country: faker.word.adjective(),
    });
    await expect(() =>
      service.findAirportFromAirline(airline.id, airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id is not associated to the airline',
    );
  });
  it('updateAirportsFromAirline should update Airport by Airline', async () => {
    const storedAirport: Airline[] = await service.updateAirportsFromAirline(
      airline.id,
      airportAirlineList,
    );
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.length).toBe(airportAirlineList.length);
  });
  it('updateAirportsFromAirline should throw an exception for an invalid Airline', async () => {
    await expect(() =>
      service.updateAirportsFromAirline('0', airportAirlineList),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
  it('updateAirportsFromAirline should throw an exception for an invalid airport', async () => {
    airportAirlineList = [];
    airportAirlineList.push({
      id: '0',
    } as AirportAirlineDto);
    await expect(() =>
      service.updateAirportsFromAirline(airline.id, airportAirlineList),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });
  it('deleteAirportFromAirline should remove a airport from airline', async () => {
    const airport: Airport = airportList[0];
    await service.deleteAirportFromAirline(airline.id, airport.id);

    const storedAirline = await repository.findOne({
      where: { id: airline.id },
      relations: ['airports'],
    });
    const deletedAirport = storedAirline.airports.find(
      (a) => a.id === airport.id,
    );

    expect(deletedAirport).toBeUndefined();
  });
  it('deleteAirportFromAirline should thrown an exception for an invalid airport', async () => {
    await expect(() =>
      service.deleteAirportFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id was not found',
    );
  });
  it('deleteAirportFromAirline should thrown an exception for an invalid airline', async () => {
    const airport: Airport = airportList[0];
    await expect(() =>
      service.deleteAirportFromAirline('0', airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
  it('deleteAirportFromAirline should throw an exception for an invalid Airport and Airline', async () => {
    const airport = await airportRepository.save({
      name: faker.word.adjective(),
      code: faker.word.adjective(),
      city: faker.word.adjective(),
      country: faker.word.adjective(),
    });
    await expect(() =>
      service.deleteAirportFromAirline(airline.id, airport.id),
    ).rejects.toHaveProperty(
      'message',
      'The airport with the given id is not associated to the airline',
    );
  });
});
