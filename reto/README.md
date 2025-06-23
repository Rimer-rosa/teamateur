# 📱 Guía de Inicio — Frontend React Native (Teamateur)

Este frontend permite interactuar con la API del backend Teamateur desde una app móvil desarrollada en React Native.

## ✅ Requisitos

- Node.js 16+
- npm o Yarn
- Expo CLI (recomendado):
  ```bash
  npm install -g expo-cli

🚀 Pasos para Ejecutar
# 1. Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd teamateur-frontend

# 2. Instalar dependencias
npm install
# o si usas Yarn
yarn install

# 3. Crear archivo .env en la raíz del proyecto con la URL de la API
API_BASE_URL=http://192.168.0.107:3000
📢 Asegúrate de usar la IP local de tu máquina (no localhost) para que el emulador o dispositivo real pueda acceder al backend.
# 4. Iniciar la app
npx expo start
# o si tienes el CLI global
expo start
