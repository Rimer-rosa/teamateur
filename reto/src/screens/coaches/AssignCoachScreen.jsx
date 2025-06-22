import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { assignCoachToTeam, getAvailableCoaches } from '../../api/coachApi';
import Button from '../../components/ui/Button';
import CustomAlert from '../../components/ui/CustomAlert';

const AssignCoachScreen = ({ route, navigation }) => {
  const { teamId, teamName } = route.params;
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'error',
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

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        setLoading(true);
        const availableCoaches = await getAvailableCoaches();
        setCoaches(availableCoaches);
      } catch (err) {
        showAlert('error', 'ERROR', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCoaches();
  }, []);

  const handleAssign = async () => {
    if (!selectedCoach) {
      showAlert('error', 'ERROR', 'Debes seleccionar un entrenador');
      return;
    }

    setLoading(true);
    try {
      await assignCoachToTeam(selectedCoach.id, teamId);
      showAlert(
        'success', 
        'ÉXITO', 
        'Entrenador asignado correctamente',
        () => navigation.navigate('ManageTeam', { 
          teamId, 
          teamName,
          shouldRefresh: true 
        })
      );
    } catch (error) {
      showAlert('error', 'ERROR', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && coaches.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.stadiumEffect}>
          <View style={styles.stadiumTop} />
          <View style={styles.centerLine} />
          <View style={styles.stadiumBottom} />
        </View>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>CARGANDO ENTRENADORES...</Text>
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
      {coaches.length > 0 ? (
        <FlatList
          data={coaches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.coachCard,
                selectedCoach?.id === item.id && styles.selectedCoach
              ]}
              onPress={() => setSelectedCoach(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.coachName}>{item.name?.toUpperCase() || 'ENTRENADOR'}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>ESTRATEGIA: {item.strategy?.toUpperCase() || 'NO ESPECIFICADA'}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>EDAD: {item.age || 'N/D'}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>NO HAY ENTRENADORES DISPONIBLES</Text>
      )}

      <Button
        title={loading ? "ASIGNANDO..." : "ASIGNAR ENTRENADOR"}
        onPress={handleAssign}
        disabled={!selectedCoach || loading}
        variant={!selectedCoach || loading ? 'secondary' : 'primary'}
        style={styles.assignButton}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0a1a2a',
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a1a2a',
  },
  loadingText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  listContainer: {
    paddingBottom: 20,
  },
  coachCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedCoach: {
    borderColor: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  coachName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    letterSpacing: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  assignButton: {
    marginTop: 20,
  },
});

export default AssignCoachScreen;