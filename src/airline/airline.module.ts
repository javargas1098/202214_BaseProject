import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from './airline.entity';
import { AirlineService } from './airline.service';
import { AirlineController } from './airline.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Airline])],
  providers: [AirlineService],
  controllers: [AirlineController],
})
export class AerolineaModule {}
