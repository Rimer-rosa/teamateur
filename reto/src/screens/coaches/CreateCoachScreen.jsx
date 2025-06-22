// src/screens/coaches/CreateCoachScreen.js
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createCoach } from '../../api/coachApi';
import Button from '../../components/ui/Button';
import CustomAlert from '../../components/ui/CustomAlert';
import Input from '../../components/ui/Input';

const strategies = [
  'Ofensiva',
  'Defensiva',
  'Contraataque',
  'Posesión',
  'Mixta'
];

const CreateCoachScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [strategy, setStrategy] = useState('');
  const [showStrategyDropdown, setShowStrategyDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
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
      showCloseButton: true,
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !age || !strategy) {
      showAlert('error', 'ERROR', 'Todos los campos son requeridos');
      return;
    }

    if (isNaN(age)) {
      showAlert('error', 'ERROR', 'La edad debe ser un número válido');
      return;
    }

    const ageNumber = parseInt(age);
    if (ageNumber < 18 || ageNumber > 100) {
      showAlert('error', 'ERROR', 'La edad debe estar entre 18 y 100 años');
      return;
    }

    setLoading(true);
    try {
      await createCoach({
        name,
        age: ageNumber,
        strategy
      });
      
      showAlert(
        'success', 
        'ÉXITO', 
        'Entrenador creado correctamente',
        () => {
          hideAlert();
          navigation.goBack();
        }
      );
    } catch (error) {
      showAlert('error', 'ERROR', error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectStrategy = (strat) => {
    setStrategy(strat);
    setShowStrategyDropdown(false);
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
          label="NOMBRE DEL ENTRENADOR"
          placeholder="Ej: Pep Guardiola"
          value={name}
          onChangeText={setName}
          containerStyle={styles.inputMargin}
        />
        
        <Input
          label="EDAD"
          placeholder="Ej: 45"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          containerStyle={styles.inputMargin}
        />
        
        <View style={[styles.inputContainer, styles.inputMargin]}>
          <Text style={styles.label}>ESTRATEGIA PREFERIDA</Text>
          <TouchableOpacity 
            style={[
              styles.strategySelector,
              strategy && styles.strategySelected
            ]}
            onPress={() => setShowStrategyDropdown(!showStrategyDropdown)}
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text style={styles.strategyText}>
              {strategy || 'Selecciona una estrategia'}
            </Text>
            <Text style={styles.dropdownIcon}>{showStrategyDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          
          {showStrategyDropdown && (
            <View style={styles.dropdown}>
              {strategies.map((strat) => (
                <TouchableOpacity
                  key={strat}
                  style={styles.dropdownItem}
                  onPress={() => selectStrategy(strat)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownItemText}>{strat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <Button 
          title={loading ? 'CREANDO ENTRENADOR...' : 'REGISTRAR ENTRENADOR'} 
          onPress={handleSubmit}
          disabled={loading}
          variant={loading ? 'secondary' : 'primary'}
        />
      </ScrollView>
      
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
  container: {
    flex: 1,
    backgroundColor: '#0a1a2a',
    position: 'relative',
  },
  scrollContainer: {
    padding: 25,
    paddingBottom: 50,
  },
  stadiumEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  stadiumTop: {
    height: 40,
    backgroundColor: '#2c3e50',
    borderBottomWidth: 8,
    borderBottomColor: '#e74c3c',
  },
  centerLine: {
    position: 'absolute',
    top: 40,
    bottom: 30,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  stadiumBottom: {
    position: 'absolute',
    bottom: 0,
    height: 30,
    backgroundColor: '#2c3e50',
    borderTopWidth: 8,
    borderTopColor: '#e74c3c',
    left: 0,
    right: 0,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputMargin: {
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    zIndex: 2,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  strategySelector: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strategySelected: {
    borderColor: '#007AFF',
  },
  strategyText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownIcon: {
    color: '#fff',
    fontSize: 12,
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    backgroundColor: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default CreateCoachScreen;