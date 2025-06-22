// src/components/ui/Input.js
import { StyleSheet, Text, TextInput, View } from 'react-native';

const Input = ({ label, placeholder, value, onChangeText, keyboardType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor="#95a5a6"
          selectionColor="#2e86de"
        />
        <View style={styles.inputUnderline} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#34495e',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 6,
    padding: 15,
    backgroundColor: '#fff',
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '500',
    elevation: 2,
  },
  inputUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#3498db',
    opacity: 0,
  },
});

export default Input;