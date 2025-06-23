import { useState } from "react";
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const SelectInput = ({
  label,
  value,
  options,
  onSelect,
  placeholder = "Selecciona una opción",
  dropdownMaxHeight = 200
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (itemValue) => {
    onSelect(itemValue);
    setIsOpen(false);
    Keyboard.dismiss();
  };

  const getLabel = () => {
    // Si las opciones son objetos con label/value
    if (options.length && typeof options[0] === "object") {
      const selectedOption = options.find(opt => opt.value === value);
      return selectedOption?.label || placeholder;
    }

    // Si las opciones son strings simples
    return value || placeholder;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.selector, value && styles.selectorSelected]}
        onPress={() => {
          Keyboard.dismiss();
          setIsOpen(!isOpen);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.selectorText} numberOfLines={1}>
          {getLabel()}
        </Text>
        <Text style={styles.dropdownIcon}>
          {isOpen ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownWrapper}>
          <ScrollView
            style={[styles.dropdown, { maxHeight: dropdownMaxHeight }]}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {options.map((option, index) => {
              // Detectar si es un string o un objeto
              const isObject = typeof option === "object";
              const optionValue = isObject ? option.value : option;
              const optionLabel = isObject ? option.label : option;

              return (
                <TouchableOpacity
                  key={optionValue || index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(optionValue)}
                >
                  <Text style={styles.dropdownItemText}>{optionLabel}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#ecf0f1",
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  selector: {
    borderWidth: 1,
    borderColor: "#34495e",
    borderRadius: 6,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorSelected: {
    borderColor: "#3498db",
  },
  selectorText: {
    color: "#ecf0f1",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginRight: 10,
  },
  dropdownIcon: {
    color: "#bdc3c7",
    fontSize: 12,
  },
  dropdownWrapper: {
    position: 'relative',
    marginTop: 5,
  },
  dropdown: {
    backgroundColor: "#2c3e50",
    borderWidth: 1,
    borderColor: "#34495e",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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

export default SelectInput;
