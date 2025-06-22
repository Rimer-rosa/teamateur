import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column()
  jerseyNumber: number;

  @Column()
  age: number;

  @Column({ default: false })
  isStarter: boolean;

  @ManyToOne(() => Team, (team) => team.players, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
