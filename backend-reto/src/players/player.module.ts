import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Team } from '../teams/entities/team.entity';
import { CoachModule } from '../coaches/coach.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, Team]),
    forwardRef(() => CoachModule),
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
