import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { Team } from '../teams/entities/team.entity';

const teamNames = [
  'Bolivar',
  'Barcelona',
  'Manchester United',
  'Bayern Munich',
  'Juventus',
  'Liverpool',
  'Paris Saint-Germain',
  'Chelsea',
  'Manchester City',
  'Arsenal'
];

interface TeamSeedData {
  name: string;
  wins: number;
  isComplete: boolean;
}

async function seedTeams() {
  try {
    console.log('Inicializando conexión a la base de datos...');
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conexión establecida correctamente');
    }

    const teamRepository = AppDataSource.getRepository(Team);
    
    console.log('Generando equipos...');
    const teams: TeamSeedData[] = []; 
    
    for (let i = 0; i < 10; i++) {
      teams.push({
        name: teamNames[i],
        wins: 0,
        isComplete: false
      });
    }

    console.log('Insertando 10 equipos...');
    await teamRepository.save(teams as any); 
    console.log('¡Equipos insertados exitosamente!');
  } catch (error) {
    console.error('Error durante el seeding:');
    console.error(error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Conexión cerrada');
    }
  }
}

seedTeams().catch(error => {
  console.error('Error inesperado:', error);
  process.exit(1);
});