// src/screens/teams/TeamsScreen.js
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getTeams } from "../../api/teamApi";
import Button from "../../components/ui/Button";

const TeamsScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  if (loading) {
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
            setError(null);
            loadTeams();
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {teams.length === 0 ? (
          <Text style={styles.emptyText}>NO HAY EQUIPOS REGISTRADOS</Text>
        ) : (
          teams.map((team) => (
            <TouchableOpacity
              key={team.id}
              style={styles.teamCard}
              onPress={() =>
                navigation.navigate("ManageTeam", {
                  teamId: team.id,
                  teamName: team.name,
                })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamInfo}>
                JUGADORES: {team.players?.length || 0}
              </Text>
            </TouchableOpacity>
          ))
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
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 25,
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  teamCard: {
    backgroundColor: "rgba(44, 62, 80, 0.7)",
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(46, 134, 222, 0.3)",
    elevation: 3,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  teamInfo: {
    fontSize: 14,
    color: "#bdc3c7",
    letterSpacing: 0.5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#ecf0f1",
    marginTop: 20,
    fontStyle: "italic",
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

export default TeamsScreen;
