import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { assignPlayerToTeam } from "../../api/playerApi";
import Button from "../../components/ui/Button";
import CustomAlert from "../../components/ui/CustomAlert";

const AssignPlayerScreen = ({ route, navigation }) => {
  const { playerId, teamId, teamName } = route.params;
  const [isStarter, setIsStarter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
    showCloseButton: true, 
  });

  const showAlert = (type, title, message, onConfirm = null) => {
    setAlert({
      visible: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  const handleAssignPlayer = async () => {
    setLoading(true);

    try {
      if (!playerId || !teamId) {
        throw new Error("Falta información del jugador o equipo");
      }

      const result = await assignPlayerToTeam(playerId, teamId, isStarter);

      if (result.success) {
        showAlert("success", "ASIGNACIÓN EXITOSA", result.message, () => {
          hideAlert();
          navigation.navigate("ManageTeam", {
            teamId,
            teamName,
            shouldRefresh: true,
            assignedPlayer: result.player,
          });
        });
      } else {
        throw new Error(
          result.message || "Error desconocido al asignar jugador"
        );
      }
    } catch (err) {
      showAlert("error", "ERROR", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stadiumEffect}>
      <View style={styles.stadiumTop} />
      <View style={styles.centerLine} />
      <View style={styles.stadiumBottom} />
    </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>¿ASIGNAR COMO TITULAR?</Text>
        <TouchableOpacity
          style={styles.switchWrapper}
          onPress={() => setIsStarter(!isStarter)}
          activeOpacity={0.7}
        >
          <View
            style={[styles.switchTrack, isStarter && styles.switchTrackActive]}
          >
            <View
              style={[
                styles.switchThumb,
                isStarter && styles.switchThumbActive,
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        {isStarter
          ? "El jugador será asignado como titular"
          : "El jugador será asignado como suplente"}
      </Text>

      <Button
        title={loading ? "ASIGNANDO..." : "CONFIRMAR ASIGNACIÓN"}
        onPress={handleAssignPlayer}
        disabled={loading}
        variant={loading ? "secondary" : "primary"}
      />

      <Button
        title="CANCELAR"
        onPress={() => navigation.goBack()}
        variant="secondary"
        disabled={loading}
        style={styles.cancelButton}
      />

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={hideAlert}
        onConfirm={alert.onConfirm}
        showCloseButton={alert.showCloseButton} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  switchWrapper: {
    padding: 2,
  },
  switchTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#767577',
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: '#81b0ff',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f4f3f4',
    position: 'absolute',
    left: 2,
  },
  switchThumbActive: {
    backgroundColor: '#007AFF',
    left: 24,
  },
  container: {
    flex: 1,
    padding: 25,
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
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  switchLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  switchWrapper: {
    padding: 2,
  },
  switchTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#767577",
    justifyContent: "center",
  },
  switchTrackActive: {
    backgroundColor: "#81b0ff",
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f4f3f4",
    marginLeft: 2,
  },
  switchThumbActive: {
    backgroundColor: "#007AFF",
    marginLeft: 24,
  },
  note: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 30,
    textAlign: "center",
    fontStyle: "italic",
  },
  cancelButton: {
    marginTop: 15,
  },
});

export default AssignPlayerScreen;
