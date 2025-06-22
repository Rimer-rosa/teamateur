import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get('available') // <-- Esta es la ruta que falta
  getAvailablePlayers() {
    return this.playerService.getAvailablePlayers();
  }

  @Get('by-position')
  findByPosition(@Query('position') position: string) {
    return this.playerService.findByPosition(position);
  }

  @Post(':id/assign') // <-- También falta esta ruta para asignar jugadores
  @Post(':id/assign')
  async assignToTeam(
    @Param('id') playerId: string,
    @Body() body: { teamId: string; isStarter: boolean },
  ) {
    const player = await this.playerService.assignToTeam(
      playerId,
      body.teamId,
      body.isStarter,
    );

    return {
      success: true,
      message: 'Jugador asignado correctamente',
      player,
    };
  }

  @Get('positions')
  getPositions() {
    return this.playerService.getPositions();
  }
}
