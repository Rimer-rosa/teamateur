import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { createCoach } from '../../api/coachApi.jsx';
import Button from '../../components/ui/Button';
import CustomAlert from '../../components/ui/CustomAlert';
import Input from '../../components/ui/Input';
import SelectInput from "../../components/ui/SelectInput";

const strategies = [
  'Contraataque',
  'Posesión',
  'Presión alta',
  'Juego directo',
  'Catenaccio',
  'Tiki-taka',
  'Gegenpressing',
  'Park the bus'
];

const CreateCoachScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [strategy, setStrategy] = useState('');
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
        
        {/* SelectInput modificado para coincidir con el que funciona */}
        <SelectInput
          label="ESTRATEGIA PREFERIDA"
          value={strategy}
          options={strategies}
          onSelect={setStrategy}
          placeholder="SELECCIONA UNA ESTRATEGIA"
          containerStyle={styles.inputMargin}
        />
        
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
  inputMargin: {
    marginBottom: 20,
  },
});

export default CreateCoachScreen;