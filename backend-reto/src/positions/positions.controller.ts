import { Controller, Get } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all valid football positions (in Spanish)' })
  getAllPositions(): string[] {
    return this.positionsService.getAll();
  }
}
