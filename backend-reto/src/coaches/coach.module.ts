import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from './entities/coach.entity';
import { Team } from '../teams/entities/team.entity';
import { CoachService } from './coach.service';
import { CoachController } from './coach.controller';
import { PlayerModule } from '../players/player.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Coach, Team]),
    forwardRef(() => PlayerModule), 
  ],
  controllers: [CoachController],
  providers: [CoachService],// Exporta CoachService
})
export class CoachModule {}