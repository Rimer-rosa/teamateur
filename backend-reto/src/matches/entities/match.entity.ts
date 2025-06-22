import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, { nullable: false, eager: true })
  @JoinColumn({ name: 'teamAId' })
  teamA: Team;

  @ManyToOne(() => Team, { nullable: false, eager: true })
  @JoinColumn({ name: 'teamBId' })
  teamB: Team;

  @ManyToOne(() => Team, { nullable: true, eager: true })
  @JoinColumn({ name: 'winnerId' })
  winner: Team;
}
