import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coach } from './entities/coach.entity';
import { Team } from '../teams/entities/team.entity';
import { CreateCoachDto } from './dto/create-coach.dto';
import { PlayerService } from '../players/player.service';

@Injectable()
export class CoachService {
  constructor(
    @InjectRepository(Coach)
    private coachRepo: Repository<Coach>,
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
    @Inject(forwardRef(() => PlayerService))
    private playerService: PlayerService,
  ) {}

  async create(dto: CreateCoachDto): Promise<Coach> {
    const existing = await this.coachRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new BadRequestException('Ya existe un entrenador con este nombre');
    }

    const coach = this.coachRepo.create({
      name: dto.name,
      age: dto.age,
      strategy: dto.strategy,
    });

    return this.coachRepo.save(coach);
  }

  async assignToTeam(coachId: string, teamId: string) {
    const coach = await this.coachRepo.findOne({
      where: { id: coachId },
      relations: ['teams'],
    });

    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['coach', 'players'],
    });

    if (!coach || !team) {
      throw new NotFoundException('Entrenador o equipo no encontrado');
    }

    if (coach.teams?.some((t) => t.id !== teamId)) {
      throw new BadRequestException(
        'Este entrenador ya está asignado a otro equipo',
      );
    }

    if (team.coach && team.coach.id !== coachId) {
      throw new BadRequestException(
        'Este equipo ya tiene un entrenador asignado',
      );
    }

    team.coach = coach;
    if (!coach.teams) coach.teams = [];
    if (!coach.teams.some((t) => t.id === teamId)) {
      coach.teams.push(team);
    }

    await this.teamRepo.save(team);
    await this.coachRepo.save(coach);

    await this.playerService.checkTeamComplete(teamId);

    return {
      coach: this.sanitizeCoach(coach),
      team: this.sanitizeTeam(team),
    };
  }

  findAll(): Promise<Coach[]> {
    return this.coachRepo.find({ relations: ['teams'] });
  }

  async getAvailableCoaches(): Promise<Coach[]> {
    const allCoaches = await this.coachRepo.find({ relations: ['teams'] });
    return allCoaches.filter((coach) => (coach.teams?.length ?? 0) === 0);
  }

  private sanitizeCoach(coach: Coach): any {
    return {
      id: coach.id,
      name: coach.name,
      age: coach.age,
      strategy: coach.strategy,
    };
  }

  private sanitizeTeam(team: Team): any {
    return {
      id: team.id,
      name: team.name,
      isComplete: team.isComplete,
      wins: team.wins,
    };
  }
}
