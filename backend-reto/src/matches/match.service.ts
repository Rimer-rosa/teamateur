import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { Team } from '../teams/entities/team.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepo: Repository<Match>,

    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
  ) {}

  async simulateMatch(teamAId: string, teamBId: string): Promise<Match> {
    const teamA = await this.teamRepo.findOne({ where: { id: teamAId } });
    const teamB = await this.teamRepo.findOne({ where: { id: teamBId } });

    if (!teamA || !teamB) {
      throw new NotFoundException('One or both teams not found');
    }

    const winner = Math.random() < 0.5 ? teamA : teamB;
    winner.wins += 1;
    await this.teamRepo.save(winner);

    const match = this.matchRepo.create({ teamA, teamB, winner });
    return this.matchRepo.save(match);
  }

  findAll(): Promise<Match[]> {
    return this.matchRepo.find();
  }
}
