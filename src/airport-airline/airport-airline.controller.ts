import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AirportDto } from '../airport/airport.dto';
import { Airport } from '../airport/airport.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AirportAirlineDto } from './airport-airline.dto';
import { AirportAirlineService } from './airport-airline.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirportAirlineController {
  constructor(private readonly airportAirlineService: AirportAirlineService) {}

  @Get(':airlineId/airports')
  async findAirportsFromAirline(@Param('airlineId') airlineId: string) {
    return await this.airportAirlineService.findAirportsFromAirline(airlineId);
  }

  @Get(':airlineId/airports/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airportAirlineService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Post(':airlineId/airports/:airportId')
  async addAirportToAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airportAirlineService.addAirportToAirline(
      airlineId,
      airportId,
    );
  }

  @Put(':airlineId/airports')
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: string,
    @Body() airportDto: AirportAirlineDto[],
  ) {
    return await this.airportAirlineService.updateAirportsFromAirline(
      airlineId,
      airportDto,
    );
  }

  @Delete(':airlineId/airports/:airportId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airportAirlineService.deleteAirportFromAirline(
      airlineId,
      airportId,
    );
  }
}
