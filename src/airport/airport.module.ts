import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportController } from './airport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './airport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airport])],
  providers: [AirportService],
  controllers: [AirportController],
})
export class AeropuertoModule {}
