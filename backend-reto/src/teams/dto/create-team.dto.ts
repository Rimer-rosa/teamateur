import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    example: 'FC Barcelona',
    description: 'Nombre del equipo',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'Estadio Camp Nou',
    description: 'Nombre del estadio del equipo',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  stadium?: string;

  @ApiProperty({
    example: 'Barcelona',
    description: 'Ciudad del equipo',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  city?: string;
}