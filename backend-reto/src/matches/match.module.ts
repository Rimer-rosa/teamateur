import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Team } from '../teams/entities/team.entity';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Team])],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
