/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {IsDate, IsString, IsUrl} from 'class-validator';

export class AirlineDto {
    
    @IsString()
    readonly name: string;
    @IsString()
    readonly description: string;
    @IsDate()
    @Type(() =>  Date)
    readonly startDate: Date;
    @IsUrl()
    readonly pageUrl: string;
}
