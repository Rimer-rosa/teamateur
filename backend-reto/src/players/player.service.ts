import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Team } from '../teams/entities/team.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  async create(dto: CreatePlayerDto): Promise<Player> {
    const existing = await this.playerRepo.findOne({
      where: {
        name: dto.name,
        jerseyNumber: dto.jerseyNumber,
      },
    });

    if (existing) {
      throw new BadRequestException('Este jugador ya existe en el sistema');
    }
    const player = this.playerRepo.create({ ...dto });
    return this.playerRepo.save(player);
  }

  async assignToTeam(
    playerId: string,
    teamId: string,
    isStarter: boolean,
  ): Promise<Player> {
    const player = await this.playerRepo.findOne({
      where: { id: playerId },
      relations: ['team'],
    });

    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['players'],
    });

    if (!player || !team) {
      throw new NotFoundException('Jugador o equipo no encontrado');
    }

    if (player.team && player.team.id !== teamId) {
      throw new BadRequestException('Este jugador ya pertenece a otro equipo');
    }

    const jerseyNumberExists = team.players.some(
      (p) => p.jerseyNumber === player.jerseyNumber && p.id !== playerId,
    );
    if (jerseyNumberExists) {
      throw new BadRequestException(
        'Número de camiseta ya está en uso en este equipo',
      );
    }

    const currentStarters = team.players.filter((p) => p.isStarter);
    const currentGoalkeepers = currentStarters.filter(
      (p) => p.position === 'arquero',
    );

    if (
      isStarter &&
      player.position === 'arquero' &&
      currentGoalkeepers.length >= 1
    ) {
      throw new BadRequestException(
        'Solo puede haber un arquero titular en el equipo',
      );
    }

    if (isStarter && currentStarters.length >= 11) {
      throw new BadRequestException(
        'El equipo ya tiene 11 jugadores titulares. Este jugador debe ser suplente',
      );
    }

    if (
      player.position === 'arquero' &&
      currentGoalkeepers.length >= 1 &&
      isStarter
    ) {
      throw new BadRequestException(
        'Ya hay un arquero titular. Los arqueros adicionales deben ser suplentes',
      );
    }

    player.team = team;
    player.isStarter = isStarter;

    await this.playerRepo.save(player);
    await this.checkTeamComplete(teamId);

    return player;
  }

  public async checkTeamComplete(teamId: string): Promise<void> {
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['players', 'coach'],
    });

    if (!team) return;

    const starters = team.players.filter((p) => p.isStarter);
    const goalkeepers = starters.filter((p) => p.position === 'arquero');

    if (goalkeepers.length > 1) {
      await Promise.all(
        goalkeepers
          .slice(1)
          .map((keeper) =>
            this.playerRepo.update(keeper.id, { isStarter: false }),
          ),
      );
      console.warn(
        `Se corrigieron múltiples arqueros titulares en equipo ${teamId}`,
      );
    }

    await this.teamRepo.update(teamId, {
      isComplete:
        starters.length === 11 && goalkeepers.length === 1 && !!team.coach,
    });
  }

  findAll(): Promise<Player[]> {
    return this.playerRepo.find({ relations: ['team'] });
  }

  findByPosition(position: string): Promise<Player[]> {
    return this.playerRepo.find({
      where: { position },
      relations: ['team'],
    });
  }

  async getPositions(): Promise<string[]> {
    const players = await this.playerRepo.find();
    const positions = [...new Set(players.map((p) => p.position))];
    return positions.filter((p) => p);
  }

  getAvailablePlayers(): Promise<Player[]> {
    return this.playerRepo.find({
      where: { team: IsNull() },
    });
  }
}
