import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';

@Entity()
export class Coach {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  strategy: string;

  @OneToMany(() => Team, (team) => team.coach)
  teams: Team[];
}
