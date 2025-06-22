// src/screens/CreateTeamScreen.js
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createTeam } from '../../api/teamApi';
import Button from '../../components/ui/Button';
import CustomAlert from '../../components/ui/CustomAlert';
import Input from '../../components/ui/Input';

const CreateTeamScreen = ({ navigation }) => {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: null,
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
    setAlert(prev => ({ ...prev, visible: false }));
  };

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      showAlert('error', 'ERROR', 'El nombre del equipo es requerido');
      return;
    }

    setLoading(true);
    try {
      await createTeam(teamName);
      showAlert(
        'success', 
        '¡ÉXITO!', 
        'Equipo creado correctamente',
        () => {
          hideAlert();
          navigation.goBack();
        }
      );
      setTeamName('');
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
      <Input
        label="NOMBRE DEL EQUIPO"
        placeholder="Ej: Los Campeones FC"
        value={teamName}
        onChangeText={setTeamName}
      />
      
      <Button 
        title={loading ? 'CREANDO EQUIPO...' : 'REGISTRAR EQUIPO'} 
        onPress={handleSubmit}
        disabled={loading}
        variant={loading ? 'secondary' : 'primary'}
      />
      
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
    padding: 25,
    backgroundColor: '#0a1a2a',
    position: 'relative',
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
    fontSize: 24,
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
});

export default CreateTeamScreen;