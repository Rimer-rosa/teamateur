import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { Coach } from '../coaches/entities/coach.entity';

const strategies = [
  'Contraataque',
  'Posesión',
  'Presión alta',
  'Juego directo',
  'Catenaccio',
  'Tiki-taka',
  'Gegenpressing',
  'Park the bus',
];

const coachNames = [
  'Pep Guardiola',
  'Jürgen Klopp',
  'Carlo Ancelotti',
  'José Mourinho',
  'Diego Simeone',
  'Zinedine Zidane',
  'Antonio Conte',
  'Thomas Tuchel',
  'Hans-Dieter Flick',
  'Julian Nagelsmann',
  'Mikel Arteta',
  'Erik ten Hag',
  'Graham Potter',
  'Luis Enrique',
  'Roberto Mancini',
];

interface CoachSeedData {
  name: string;
  age: number;
  strategy: string;
}

async function seedCoaches() {
  try {
    console.log('Inicializando conexión a la base de datos...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conexión establecida correctamente');
    }

    const coachRepository = AppDataSource.getRepository(Coach);

    console.log('Generando entrenadores...');
    const coaches: CoachSeedData[] = []; 

    for (let i = 0; i < 15; i++) {
      coaches.push({
        name: coachNames[i],
        age: Math.floor(Math.random() * 30) + 40, 
        strategy: strategies[Math.floor(Math.random() * strategies.length)],
      });
    }

    console.log('Insertando 15 entrenadores...');
    await coachRepository.save(coaches as any); 
    console.log('¡Entrenadores insertados exitosamente!');
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

seedCoaches().catch((error) => {
  console.error('Error inesperado:', error);
  process.exit(1);
});
