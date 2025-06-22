import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({
    example: 'Lionel Messi',
    description: 'Player name',
  })
  name: string;

  @ApiProperty({
    example: 'Forward',
    description: 'Player position',
  })
  position: string;

  @ApiProperty({
    example: 10,
    description: 'Jersey number',
  })
  jerseyNumber: number;

  @ApiProperty({
    example: 36,
    description: 'Player age',
  })
  age: number;

  @ApiProperty({
    example: '666fae174e70e6a024b76c4b',
    description: 'ID of the team the player belongs to',
  })
  teamId: string;
  @ApiProperty({
    example: true,
    description: 'Indica si el jugador es titular o está en la banca',
  })
  isStarter: boolean;
}
