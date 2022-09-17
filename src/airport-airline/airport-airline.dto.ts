/* eslint-disable prettier/prettier */

import { IsString } from 'class-validator';

export class AirportAirlineDto {
    
    @IsString()
    readonly id: string;
}