import { Injectable } from '@nestjs/common';

@Injectable()
export class PositionsService {
  private readonly positions: string[] = [
    'Arquero',
    'Defensa central',
    'Lateral derecho',
    'Lateral izquierdo',
    'Mediocampista defensivo',
    'Mediocampista ofensivo',
    'Volante',
    'Extremo derecho',
    'Extremo izquierdo',
    'Delantero',
  ];

  getAll(): string[] {
    return this.positions;
  }
}
