// src/data-source.ts
import { DataSource } from 'typeorm';
import { Player } from './players/entities/player.entity';
import { Team } from './teams/entities/team.entity';
import { Coach } from './coaches/entities/coach.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '8805290',
  database: process.env.DB_NAME || 'teamateur',
  entities: [Player, Team, Coach],
  synchronize: false,
  logging: true,
});