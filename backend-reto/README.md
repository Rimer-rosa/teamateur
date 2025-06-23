# 🚀 Guía de Configuración del Proyecto Reto — Teamateur

Este es un sistema backend para gestionar equipos de fútbol, desarrollado con NestJS, TypeORM y PostgreSQL.

## 📦 Requisitos

- PostgreSQL 14+
- Node.js 16+ y npm 8+
- (Opcional) TypeORM CLI global: `npm install -g typeorm`

## 🔧 Pasos de Configuración

```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd backend-reto

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env en la raíz del proyecto con el siguiente contenido:
# (ajusta la contraseña según tu instalación local de PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=teamateur
# 4. Crear la base de datos
createdb -U postgres teamateur

# 5. Generar las migraciones iniciales (solo si no existen aún)
npm run typeorm migration:generate -- -n InitialSchema

# 6. Ejecutar las migraciones para crear las tablas
npm run typeorm migration:run

# 7. Poblar la base de datos con datos de ejemplo (ejecutar en orden)

# Entrenadores
npx ts-node src/seeds/coach.seed.ts

# Equipos
npx ts-node src/seeds/team.seed.ts

# Jugadores
npx ts-node src/seeds/player.seed.ts

# 8. Ejecutar el servidor en modo desarrollo
npm run start:dev
