/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AerolineaModule } from './airline/airline.module';
import { AeropuertoModule } from './airport/airport.module';
import { Airline } from './airline/airline.entity';
import { Airport } from './airport/airport.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportAirlineModule } from './airport-airline/airport-airline.module';

@Module({
  imports: [AerolineaModule, AeropuertoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'postgres',
      entities: [Airline, Airport],
      dropSchema: false,
      synchronize: true,
      keepConnectionAlive: true
    }),
    AirportAirlineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
