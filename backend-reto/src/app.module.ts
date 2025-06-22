import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamModule } from './teams/team.module';
import { PlayerModule } from './players/player.module';
import { CoachModule } from './coaches/coach.module';
import { MatchModule } from './matches/match.module';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || '8805290',
        database: configService.get<string>('DB_NAME') || 'teamateur',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TeamModule,
    PlayerModule,
    CoachModule,
    MatchModule,
    PositionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}