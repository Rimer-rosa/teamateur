import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAvailablePlayers, getPositions } from "../../api/playerApi";
import Button from "../../components/ui/Button";
import SelectInput from "../../components/ui/SelectInput";

const AddPlayersScreen = ({ route, navigation }) => {
  const { teamId, teamName } = route.params;
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [availablePlayers, positionsData] = await Promise.all([
          getAvailablePlayers(),
          getPositions(),
        ]);

        setPlayers(availablePlayers);
        setFilteredPlayers(availablePlayers);
        setPositions(["all", ...positionsData]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handlePositionChange = (position) => {
    setSelectedPosition(position);
    if (position === "all") {
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers(players.filter((p) => p.position === position));
    }
  };

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
            loadData();
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

      <View style={styles.filterContainer}>
        <SelectInput
          label="FILTRAR POR POSICIÓN"
          value={
            selectedPosition === "all"
              ? "TODAS LAS POSICIONES"
              : selectedPosition.toUpperCase()
          }
          options={positions.map((pos) =>
            pos === "all" ? "TODAS LAS POSICIONES" : pos.toUpperCase()
          )}
          onSelect={(pos) =>
            handlePositionChange(
              pos === "TODAS LAS POSICIONES" ? "all" : pos.toLowerCase()
            )
          }
          placeholder="SELECCIONA POSICIÓN"
        />
      </View>

      {filteredPlayers.length > 0 ? (
        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.playerCard}
              onPress={() =>
                navigation.navigate("AssignPlayer", {
                  playerId: item.id,
                  teamId,
                  teamName,
                })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.playerName}>{item.name.toUpperCase()}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>
                  NÚMERO: {item.jerseyNumber}
                </Text>
                <Text style={[styles.detailText, styles.positionText]}>
                  POSICIÓN: {item.position.toUpperCase()}
                </Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>EDAD: {item.age}</Text>
                <Text style={styles.detailText}>
                  NACIONALIDAD: {item.nationality?.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>
          {selectedPosition === "all"
            ? "NO HAY JUGADORES DISPONIBLES"
            : `NO HAY JUGADORES DISPONIBLES PARA LA POSICIÓN ${selectedPosition.toUpperCase()}`}
        </Text>
      )}
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
  filterContainer: {
    margin: 15,
    marginBottom: 20,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  playerCard: {
    backgroundColor: "rgba(44, 62, 80, 0.7)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(46, 134, 222, 0.3)",
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: "#bdc3c7",
    letterSpacing: 0.3,
  },
  positionText: {
    color: "#2e86de",
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#bdc3c7",
    fontStyle: "italic",
    letterSpacing: 0.5,
    paddingHorizontal: 20,
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

export default AddPlayersScreen;
