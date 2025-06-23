import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { Player } from '../players/entities/player.entity';

const positions = [
  'Arquero',
  'Defensa central',
  'Lateral derecho',
  'Lateral izquierdo',
  'Mediocampista defensivo',
  'Mediocampista ofensivo',
  'Volante',
  'Extremo derecho',
  'Extremo izquierdo',
  'Delantero',
];

const firstNames = [
  'Lionel', 'Cristiano', 'Neymar', 'Kylian', 'Robert', 'Kevin', 'Mohamed',
  'Sergio', 'Virgil', 'Karim', 'Luka', 'Toni', 'Antoine', 'Paul', 'Eden',
  'Harry', 'Raheem', 'Sadio', 'Alisson', 'Ederson', 'Thibaut', 'Jan', 'Manuel',
  'David', 'Sergio', 'Gerard', 'Xavi', 'Andrés', 'Iker', 'Fernando', 'Diego',
  'Radamel', 'James', 'Juan', 'Arturo', 'Alexis', 'Claudio', 'Ivan', 'Marcelo',
  'Dani', 'Jordi', 'Pedro', 'Cesc', 'Thiago', 'Javi', 'Santi', 'Gaël', 'Raphaël',
  'Olivier', 'Blaise'
];

const lastNames = [
  'Messi', 'Ronaldo', 'Jr', 'Mbappé', 'Lewandowski', 'De Bruyne', 'Salah',
  'Ramos', 'van Dijk', 'Benzema', 'Modrić', 'Kroos', 'Griezmann', 'Pogba', 'Hazard',
  'Kane', 'Sterling', 'Mané', 'Becker', 'Moraes', 'Courtois', 'Oblak', 'Neuer',
  'de Gea', 'Agüero', 'Piqué', 'Hernández', 'Iniesta', 'Casillas', 'Torres',
  'Forlán', 'Falcao', 'Rodríguez', 'Cuadrado', 'Vidal', 'Sánchez', 'Bravo',
  'Rakitić', 'Vieira', 'Alves', 'Alba', 'Rodríguez', 'Fàbregas', 'Alcántara',
  'Martínez', 'Cazorla', 'Clichy', 'Varane', 'Giroud', 'Matuidi'
];

function getRandomItem(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

interface PlayerSeedData {
  name: string;
  position: string;
  jerseyNumber: number;
  age: number;
  isStarter: boolean;
  team?: any;
}

async function seedPlayers() {
  try {
    console.log('Inicializando conexión a la base de datos...');
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conexión establecida correctamente');
    }

    const playerRepository = AppDataSource.getRepository(Player);
    
    console.log('Generando jugadores...');
    const players: PlayerSeedData[] = [];
    
    for (let i = 0; i < 50; i++) {
      players.push({
        name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
        position: getRandomItem(positions),
        jerseyNumber: Math.floor(Math.random() * 100) + 1,
        age: Math.floor(Math.random() * 36) + 15,
        isStarter: false
      });
    }

    console.log('Insertando 50 jugadores...');
    await playerRepository.save(players as any); 
    console.log('¡Jugadores insertados exitosamente!');
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

seedPlayers().catch(error => {
  console.error('Error inesperado:', error);
  process.exit(1);
});