import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { Airline } from './airline.entity';
import { AirlineService } from './airline.service';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<Airline>;
  let airlineList: Airline[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<Airline>>(getRepositoryToken(Airline));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    airlineList = [];
    for (let i = 0; i < 5; i++) {
      const airline = new Airline();
      airline.name = faker.word.adjective();
      airline.description = faker.lorem.lines();
      airline.startDate = faker.date.past();
      airline.pageUrl = 'www.test.com';
      await repository.save(airline);
      airlineList.push(airline);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll should return all airlines', async () => {
    const airline: Airline[] = await service.findAll();
    expect(airline).not.toBeNull();
    expect(airline).toHaveLength(airlineList.length);
  });

  it('findOne should return a airline by id', async () => {
    const storedAirline: Airline = airlineList[0];
    const airline: Airline = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('create should return a new airline', async () => {
    const airline: Airline = {
      id: '',
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      startDate: faker.date.past(),
      pageUrl: 'www.test.com',
      airports: [],
    };
    const newRestaurant: Airline = await service.create(airline);
    expect(newRestaurant).not.toBeNull();

    const storedAirline: Airline = await repository.findOne({
      where: { id: newRestaurant.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(newRestaurant.name);
  });
  it('create throw an exception for invalid date', async () => {
    const airline: Airline = {
      id: '',
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      startDate: faker.date.future(),
      pageUrl: 'www.test.com',
      airports: [],
    };
    await expect(() => service.create(airline)).rejects.toHaveProperty(
      'message',
      'The airline start date must be less than actual date',
    );
  });

  it('update should modify a airline', async () => {
    const airline: Airline = airlineList[0];
    airline.name = 'New name';
    const updatedRestaurant: Airline = await service.update(
      airline.id,
      airline,
    );
    expect(updatedRestaurant).not.toBeNull();
    const storedAirline: Airline = await repository.findOne({
      where: { id: airline.id },
    });
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name);
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: Airline = airlineList[0];
    airline = {
      ...airline,
      name: 'New name',
    };
    await expect(() => service.update('0', airline)).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid date', async () => {
    let airline: Airline = airlineList[0];
    airline = {
      ...airline,
      name: 'New name',
      startDate: faker.date.future(),
    };
    await expect(() =>
      service.update(airline.id, airline),
    ).rejects.toHaveProperty(
      'message',
      'The airline start date must be less than actual date',
    );
  });

  it('delete should remove a airline', async () => {
    const airline: Airline = airlineList[0];
    await service.delete(airline.id);
    const deleteRestaurant: Airline = await repository.findOne({
      where: { id: airline.id },
    });
    expect(deleteRestaurant).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    const airline: Airline = airlineList[0];
    await service.delete(airline.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The airline with the given id was not found',
    );
  });
});
