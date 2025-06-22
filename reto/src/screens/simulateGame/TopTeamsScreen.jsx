import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getTopCompleteTeams } from '../../api/teamApi';
import Button from '../../components/ui/Button';
import CustomAlert from '../../components/ui/CustomAlert';

const TopTeamsScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const loadTeams = async () => {
    try {
      setLoading(true);
      const topTeams = await getTopCompleteTeams();
      setTeams(topTeams);
    } catch (error) {
      showAlert(
        'error', 
        'ERROR', 
        'No se pudieron cargar los equipos completos',
        () => loadTeams()
      );
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTeams();
  };

  const renderTeamItem = ({ item, index }) => (
    <View style={styles.teamCard}>
      <View style={styles.positionContainer}>
        <Text style={styles.positionText}>{index + 1}°</Text>
      </View>
      
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.name}</Text>
        <Text style={styles.teamDetails}>
          ENTRENADOR: {item.coach?.name || 'SIN ENTRENADOR'}
        </Text>
        <Text style={styles.winsText}>VICTORIAS: {item.wins}</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.stadiumEffect}>
          <View style={styles.stadiumTop} />
          <View style={styles.centerLine} />
          <View style={styles.stadiumBottom} />
        </View>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>CARGANDO CLASIFICACIÓN...</Text>
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

      <Text style={styles.title}>CLASIFICACIÓN DE EQUIPOS</Text>
      <Text style={styles.subtitle}>TOP 10 EQUIPOS COMPLETOS CON MÁS VICTORIAS</Text>

      <FlatList
        data={teams}
        renderItem={renderTeamItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>NO SE ENCONTRARON EQUIPOS COMPLETOS</Text>
            <Button 
              title="RECARGAR" 
              onPress={loadTeams}
              style={styles.refreshButton}
              variant="primary"
            />
          </View>
        }
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#fff',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  teamCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  positionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    width: 40,
  },
  positionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  teamDetails: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  winsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 6,
    letterSpacing: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  refreshButton: {
    width: 150,
  },
});

export default TopTeamsScreen;