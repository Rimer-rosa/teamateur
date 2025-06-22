// src/screens/teams/ManageTeamScreen.js
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getTeamRoster } from "../../api/teamApi";
import Button from "../../components/ui/Button";

const ManageTeamScreen = ({ route, navigation }) => {
  const { teamId, teamName } = route.params;
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTeamData = async () => {
    try {
      const teamData = await getTeamRoster(teamId);
      const formattedTeam = {
        ...teamData,
        players: teamData.players || [],
      };
      setTeam(formattedTeam);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadTeamData);
    loadTeamData();
    return unsubscribe;
  }, [teamId, navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTeamData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.stadiumEffect}>
          <View style={styles.stadiumTop} />
          <View style={styles.centerLine} />
          <View style={styles.stadiumBottom} />
        </View>
        <ActivityIndicator size="large" color="#2e86de" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.stadiumEffect}>
          <View style={styles.stadiumTop} />
          <View style={styles.centerLine} />
          <View style={styles.stadiumBottom} />
        </View>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="REINTENTAR"
          onPress={() => {
            setLoading(true);
            loadTeamData();
          }}
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.stadiumEffect}>
        <View style={styles.stadiumTop} />
        <View style={styles.centerLine} />
        <View style={styles.stadiumBottom} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2e86de"]}
            tintColor="#2e86de"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.teamStats}>
            {team?.players?.length || 0} JUGADORES |{" "}
            {team?.coach ? "CON ENTRENADOR" : "SIN ENTRENADOR"}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="AGREGAR JUGADORES"
            onPress={() =>
              navigation.navigate("AddPlayers", {
                teamId,
                teamName,
                onGoBack: () => loadTeamData(),
              })
            }
            style={styles.actionButton}
          />
        </View>

        {/* Listado de jugadores */}
        <Text style={styles.sectionTitle}>
          JUGADORES DEL EQUIPO ({team?.players?.length || 0})
        </Text>

        {team?.players?.length > 0 ? (
          team.players.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={[
                styles.playerCard,
                player.isStarter && styles.starterCard,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.playerName}>
                #{player.jerseyNumber} - {player.name.toUpperCase()}
                {player.isStarter && (
                  <Text style={styles.starterBadge}> ★</Text>
                )}
              </Text>
              <View style={styles.playerDetails}>
                <Text style={styles.playerDetail}>
                  POSICIÓN: {player.position.toUpperCase()}
                </Text>
                <Text style={styles.playerDetail}>EDAD: {player.age}</Text>
                <Text
                  style={[
                    styles.playerDetail,
                    player.isStarter
                      ? styles.starterText
                      : styles.substituteText,
                  ]}
                >
                  {player.isStarter ? "TITULAR" : "SUPLENTE"}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              NO HAY JUGADORES EN ESTE EQUIPO
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>ENTRENADOR</Text>
        {team?.coach ? (
          <View style={styles.coachCard}>
            <Text style={styles.coachName}>
              {team.coach.name.toUpperCase()}
            </Text>
            <View style={styles.coachDetails}>
              <Text style={styles.coachDetail}>EDAD: {team.coach.age}</Text>
              <Text style={styles.coachDetail}>
                ESTRATEGIA: {team.coach.strategy.toUpperCase()}
              </Text>
              <Text style={styles.coachDetail}>
                EXPERIENCIA: {team.coach.experience} AÑOS
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>NO HAY ENTRENADOR ASIGNADO</Text>
            <Button
              title="AGREGAR ENTRENADOR"
              onPress={() =>
                navigation.navigate("AssignCoach", { teamId, teamName })
              }
              variant="secondary"
              style={styles.actionButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1a2a",
    position: "relative",
  },
  stadiumEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  stadiumTop: {
    height: 40,
    backgroundColor: "#2c3e50",
    borderBottomWidth: 8,
    borderBottomColor: "#e74c3c",
  },
  centerLine: {
    position: "absolute",
    top: 40,
    bottom: 30,
    left: "50%",
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  stadiumBottom: {
    position: "absolute",
    bottom: 0,
    height: 30,
    backgroundColor: "#2c3e50",
    borderTopWidth: 8,
    borderTopColor: "#e74c3c",
    left: 0,
    right: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(10, 26, 42, 0.9)",
  },
  scrollContainer: {
    padding: 25,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  teamName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  teamStats: {
    fontSize: 14,
    color: "#bdc3c7",
    textAlign: "center",
    marginTop: 5,
    letterSpacing: 0.5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginVertical: 15,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  playerCard: {
    backgroundColor: "rgba(44, 62, 80, 0.7)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(46, 134, 222, 0.3)",
  },
  starterCard: {
    backgroundColor: "rgba(230, 167, 0, 0.1)",
    borderColor: "rgba(230, 167, 0, 0.5)",
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  starterBadge: {
    color: "#e6a700",
    fontWeight: "bold",
  },
  playerDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  playerDetail: {
    fontSize: 13,
    color: "#bdc3c7",
    width: "48%",
    marginBottom: 5,
    letterSpacing: 0.3,
  },
  starterText: {
    color: "#e6a700",
    fontWeight: "500",
  },
  substituteText: {
    color: "#bdc3c7",
  },
  coachCard: {
    backgroundColor: "rgba(46, 134, 222, 0.1)",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(46, 134, 222, 0.3)",
  },
  coachName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  coachDetails: {
    marginTop: 5,
  },
  coachDetail: {
    fontSize: 13,
    color: "#bdc3c7",
    marginBottom: 5,
    letterSpacing: 0.3,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(44, 62, 80, 0.3)",
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  emptyText: {
    textAlign: "center",
    color: "#bdc3c7",
    fontStyle: "italic",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  errorText: {
    color: "#e74c3c",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default ManageTeamScreen;
