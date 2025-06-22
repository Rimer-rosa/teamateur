import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const existing = await this.teamRepo.findOne({
      where: { name: createTeamDto.name },
    });
    if (existing) {
      throw new BadRequestException('Ya existe un equipo con este nombre');
    }

    const team = this.teamRepo.create({
      ...createTeamDto,
      players: [],
      coach: undefined,
      wins: 0,
    });

    return this.teamRepo.save(team);
  }

  findAll(): Promise<Team[]> {
    return this.teamRepo.find({ relations: ['players', 'coach'] });
  }

  async findById(id: string) {
    const team = await this.teamRepo.findOne({
      where: { id },
      relations: ['players', 'coach'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    const starters = team.players.filter((p) => p.isStarter);
    const bench = team.players.filter((p) => !p.isStarter);
    const hasGoalkeeper = starters.some(
      (p) => p.position.toLowerCase() === 'arquero',
    );
    const isComplete = starters.length === 11 && hasGoalkeeper && !!team.coach;

    return {
      ...team,
      starters,
      bench,
      isComplete,
      startersCount: starters.length,
      hasGoalkeeper,
      hasCoach: !!team.coach,
    };
  }

  async simulateMatch(team1Id: string, team2Id: string) {
    const team1 = await this.findById(team1Id);
    const team2 = await this.findById(team2Id);

    if (!team1.isComplete || !team2.isComplete) {
      throw new BadRequestException(
        'Ambos equipos deben estar completos (11 titulares, arquero y entrenador)',
      );
    }

    const winnerId = Math.random() > 0.5 ? team1Id : team2Id;

    const generateRandomStats = () => ({
      possession: Math.floor(Math.random() * 30) + 35,
      shots: Math.floor(Math.random() * 15) + 5,
      shotsOnTarget: Math.floor(Math.random() * 10) + 3,
      corners: Math.floor(Math.random() * 8) + 2,
      fouls: Math.floor(Math.random() * 15) + 5,
      yellowCards: Math.floor(Math.random() * 4),
      redCards: Math.random() > 0.9 ? 1 : 0,
    });

    const team1Stats = generateRandomStats();
    const team2Stats = generateRandomStats();

    const totalPossession = team1Stats.possession + team2Stats.possession;
    team1Stats.possession = Math.round(
      (team1Stats.possession / totalPossession) * 100,
    );
    team2Stats.possession = 100 - team1Stats.possession;

    await this.addWin(winnerId);

    return {
      winner: winnerId === team1Id ? team1 : team2,
      loser: winnerId === team1Id ? team2 : team1,
      stats: {
        team1: team1Stats,
        team2: team2Stats,
      },
      date: new Date().toISOString(),
    };
  }

  async addWin(teamId: string): Promise<Team> {
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['players', 'coach'],
    });

    if (!team) throw new NotFoundException('Equipo no encontrado');

    team.wins += 1;
    await this.teamRepo.save(team);

    return team;
  }

  async getTopCompleteTeams(): Promise<Team[]> {
    try {
      const teams = await this.teamRepo.find({
        relations: ['players', 'coach'],
        order: { wins: 'DESC' },
      });

      return teams
        .filter((team) => {
          try {
            const starters = team.players?.filter((p) => p.isStarter) || [];
            const hasGoalkeeper = starters.some((p) =>
              ['arquero', 'portero', 'goalkeeper'].includes(
                p.position.toLowerCase(),
              ),
            );
            return starters.length === 11 && hasGoalkeeper && !!team.coach;
          } catch (error) {
            console.error(`Error verificando equipo ${team.id}:`, error);
            return false;
          }
        })
        .slice(0, 10);
    } catch (error) {
      console.error('Error en getTopCompleteTeams:', error);
      throw error;
    }
  }
  async getTeamRoster(teamId: string) {
    return this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['players', 'coach'],
    });
  }
}
