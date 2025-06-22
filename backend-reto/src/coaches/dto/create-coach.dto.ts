import { ApiProperty } from '@nestjs/swagger';

export class CreateCoachDto {
  @ApiProperty({
    example: 'Pep Guardiola',
    description: 'Coach name',
  })
  name: string;

  @ApiProperty({
    example: 52,
    description: 'Coach age',
  })
  age: number;

  @ApiProperty({
    example: 'Attacking',
    description: 'Coach strategy',
  })
  strategy: string;

  @ApiProperty({
  example: '666fae174e70e6a024b76c4b',
  description: 'ID of the team the coach belongs to',
  required: false  
})
teamId?: string;  
}
