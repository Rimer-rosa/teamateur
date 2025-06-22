import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AssignCoachScreen from "../screens/coaches/AssignCoachScreen";
import CreateCoachScreen from "../screens/coaches/CreateCoachScreen";
import HomeScreen from "../screens/HomeScreen";
import CreatePlayerScreen from "../screens/players/CreatePlayerScreen";
import MatchDetailsScreen from "../screens/simulateGame/MatchDetailsScreen";
import PlayMatchScreen from "../screens/simulateGame/PlayMatchScreen";
import TopTeamsScreen from "../screens/simulateGame/TopTeamsScreen";
import AddPlayersScreen from "../screens/teams/AddPlayersScreen";
import AssignPlayerScreen from "../screens/teams/AssignPlayerScreen";
import CreateTeamScreen from "../screens/teams/CreateTeamScreen";
import ManageTeamScreen from "../screens/teams/ManageTeamScreen";
import TeamsScreen from "../screens/teams/TeamsScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0a1a2a",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 13,
          letterSpacing: 1,
        },
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "INICIO",
          headerStyle: {
            backgroundColor: "#0a1a2a",
            borderBottomWidth: 8,
            borderBottomColor: "#e74c3c",
          },
        }}
      />
      <Stack.Screen
        name="CreateTeam"
        component={CreateTeamScreen}
        options={{
          title: "CREAR NUEVO EQUIPO",
          headerBackTitle: "ATRÁS",
        }}
      />
      <Stack.Screen
        name="Teams"
        component={TeamsScreen}
        options={{
          title: "TODOS LOS EQUIPOS",
          headerBackTitle: "ATRÁS",
        }}
      />

      {/* Pantallas de Jugadores */}
      <Stack.Screen
        name="CreatePlayer"
        component={CreatePlayerScreen}
        options={{
          title: "AGREGAR JUGADOR",
          headerBackTitle: "ATRÁS",
        }}
      />
      <Stack.Screen
        name="AddPlayers"
        component={AddPlayersScreen}
        options={({ route }) => ({
          title: `AGREGAR JUGADORES A ${route.params.teamName.toUpperCase()}`,
          headerBackTitle: "ATRÁS",
        })}
      />
      <Stack.Screen
        name="AssignPlayer"
        component={AssignPlayerScreen}
        options={{
          title: "ASIGNAR JUGADOR",
          headerBackTitle: "ATRÁS",
        }}
      />

      <Stack.Screen
        name="ManageTeam"
        component={ManageTeamScreen}
        options={({ route }) => ({
          title: route.params.teamName.toUpperCase(),
          headerBackTitle: "ATRÁS",
        })}
      />
      <Stack.Screen
        name="CreateCoach"
        component={CreateCoachScreen}
        options={{
          title: "CREAR NUEVO ENTRENADOR",
          headerBackTitle: "ATRÁS",
        }}
      />
      <Stack.Screen
        name="AssignCoach"
        component={AssignCoachScreen}
        options={({ route }) => ({
          title: `ENTRENADORES PARA ${route.params.teamName.toUpperCase()}`,
          headerBackTitle: "ATRÁS",
        })}
      />
      <Stack.Screen
        name="PlayMatch"
        component={PlayMatchScreen}
        options={{
          title: "SIMULAR PARTIDO",
          headerBackTitle: "ATRÁS",
        }}
      />
      <Stack.Screen
        name="MatchDetails"
        component={MatchDetailsScreen}
        options={{
          title: "DETALLES DEL PARTIDO",
          headerBackTitle: "ATRÁS",
        }}
      />
      <Stack.Screen
        name="TopTeams"
        component={TopTeamsScreen}
        options={{
          title: "CLASIFICACIÓN",
          headerBackTitle: "ATRÁS",
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
