import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTeamDto: CreateTeamDto) {
    try {
      return await this.teamService.create(createTeamDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findById(id);
  }

  @Get(':id/roster')
  async getRoster(@Param('id') id: string) {
    return this.teamService.getTeamRoster(id);
  }

  @Get('top/complete-winners')
  @HttpCode(HttpStatus.OK)
  async getTopCompleteTeams() {
    try {
      return await this.teamService.getTopCompleteTeams();
    } catch (error) {
      throw new HttpException(
        'Error al obtener equipos completos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('simulate-match')
  @HttpCode(HttpStatus.OK)
  async simulateMatch(@Body() body: { team1Id: string; team2Id: string }) {
    try {
      const team1 = await this.teamService.findById(body.team1Id);
      const team2 = await this.teamService.findById(body.team2Id);

      if (!team1.isComplete || !team2.isComplete) {
        throw new BadRequestException(
          'Ambos equipos deben estar completos (11 titulares y entrenador)',
        );
      }

      const isTeam1Winner = Math.random() > 0.5;
      const winnerId = isTeam1Winner ? body.team1Id : body.team2Id;

      const generateStats = (isWinner: boolean) => ({
        possession: Math.floor(Math.random() * 20) + (isWinner ? 45 : 35),
        shots: Math.floor(Math.random() * 10) + (isWinner ? 5 : 3),
        shotsOnTarget: Math.floor(Math.random() * 7) + (isWinner ? 3 : 2),
        corners: Math.floor(Math.random() * 5) + (isWinner ? 2 : 1),
        fouls: Math.floor(Math.random() * 10) + 5,
        yellowCards: Math.floor(Math.random() * 3),
        redCards: Math.random() > 0.9 ? 1 : 0,
      });

      const team1Stats = generateStats(isTeam1Winner);
      const team2Stats = generateStats(!isTeam1Winner);

      const totalPossession = team1Stats.possession + team2Stats.possession;
      team1Stats.possession = Math.round(
        (team1Stats.possession / totalPossession) * 100,
      );
      team2Stats.possession = 100 - team1Stats.possession;

      await this.teamService.addWin(winnerId);

      return {
        winner: isTeam1Winner ? team1 : team2,
        loser: isTeam1Winner ? team2 : team1,
        stats: {
          team1: team1Stats,
          team2: team2Stats,
        },
        date: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }
}
