import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Coach } from '../../coaches/entities/coach.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Player, (player) => player.team, {
    cascade: true,
    eager: true,
  })
  players: Player[];

  @ManyToOne(() => Coach, (coach) => coach.teams, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: false })
  isComplete: boolean;

  @Column({ nullable: true })
  stadium?: string;

  @Column({ nullable: true })
  city?: string;

  public checkCompleteness(): boolean {
    if (!this.players || !this.coach) return false;

    const starters = this.players.filter((player) => player.isStarter);
    const hasGoalkeeper = starters.some(
      (player) => player.position === 'arquero',
    );

    this.isComplete = starters.length === 11 && hasGoalkeeper && !!this.coach;
    return this.isComplete;
  }
}
