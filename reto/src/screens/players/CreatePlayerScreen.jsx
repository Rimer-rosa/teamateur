import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { createPlayer, getPositions } from "../../api/playerApi";
import Button from "../../components/ui/Button";
import CustomAlert from "../../components/ui/CustomAlert";
import Input from "../../components/ui/Input";
import SelectInput from "../../components/ui/SelectInput";

const CreatePlayerScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [age, setAge] = useState("");
  const [positions, setPositions] = useState([]);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const pos = await getPositions();
        setPositions(pos);
      } catch (error) {
        showAlert("error", "Error", "No se pudieron cargar las posiciones");
      }
    };
    loadPositions();
  }, []);

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

  const handleSubmit = async () => {
    if (!name.trim() || !position || !jerseyNumber || !age) {
      showAlert("error", "ERROR", "Todos los campos son requeridos");
      return;
    }

    if (isNaN(jerseyNumber)) {
      showAlert("error", "ERROR", "El número de camiseta debe ser un número");
      return;
    }

    if (isNaN(age)) {
      showAlert("error", "ERROR", "La edad debe ser un número");
      return;
    }

    setLoading(true);
    try {
      await createPlayer({
        name,
        position,
        jerseyNumber: parseInt(jerseyNumber),
        age: parseInt(age),
        isStarter: false,
      });

      showAlert("success", "¡ÉXITO!", "Jugador creado correctamente", () => {
        hideAlert();
        navigation.goBack();
      });
    } catch (error) {
      showAlert("error", "ERROR", error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectPosition = (pos) => {
    setPosition(pos);
    setShowPositionDropdown(false);
  };

return (
    <View style={styles.container}>
      <View style={styles.stadiumEffect}>
        <View style={styles.stadiumTop} />
        <View style={styles.centerLine} />
        <View style={styles.stadiumBottom} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="NOMBRE DEL JUGADOR"
          placeholder="Ej: Lionel Messi"
          value={name}
          onChangeText={setName}
        />

        <SelectInput
          label="POSICIÓN"
          value={position}
          options={positions}
          onSelect={setPosition}
          placeholder="SELECCIONA UNA POSICIÓN"
        />

        <Input
          label="NÚMERO DE CAMISETA"
          placeholder="Ej: 10"
          value={jerseyNumber}
          onChangeText={setJerseyNumber}
          keyboardType="numeric"
        />

        <Input
          label="EDAD"
          placeholder="Ej: 34"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Button
          title={loading ? "REGISTRANDO..." : "REGISTRAR JUGADOR"}
          onPress={handleSubmit}
          disabled={loading}
          variant={loading ? "secondary" : "primary"}
        />
      </ScrollView>

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={hideAlert}
        onConfirm={alert.onConfirm}
      />
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
  scrollContainer: {
    padding: 25,
    paddingBottom: 50,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
    zIndex: 2,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#ecf0f1",
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  positionSelector: {
    borderWidth: 1,
    borderColor: "#34495e",
    borderRadius: 6,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  positionSelected: {
    borderColor: "#3498db",
  },
  positionText: {
    color: "#ecf0f1",
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownIcon: {
    color: "#bdc3c7",
    fontSize: 12,
  },
  dropdown: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#34495e",
    borderRadius: 6,
    backgroundColor: "#2c3e50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#ecf0f1",
  },
});

export default CreatePlayerScreen;
