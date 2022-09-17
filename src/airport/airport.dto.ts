import { IsString } from 'class-validator';

export class AirportDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly code: string;
  @IsString()
  readonly country: string;
  @IsString()
  readonly city: string;
}
