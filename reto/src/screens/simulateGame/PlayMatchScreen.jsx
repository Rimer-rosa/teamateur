import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTeamRoster, getTeams, simulateMatch } from '../../api/teamApi';
import Button from '../../components/ui/Button';
import CustomAlert from '../../components/ui/CustomAlert';

const PlayMatchScreen = ({ navigation }) => {
  const [allTeams, setAllTeams] = useState([]);
  const [completeTeams, setCompleteTeams] = useState([]);
  const [selectedTeam1, setSelectedTeam1] = useState(null);
  const [selectedTeam2, setSelectedTeam2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [teamDetails, setTeamDetails] = useState({});
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
    const loadTeams = async () => {
      try {
        setLoading(true);
        const teams = await getTeams();
        setAllTeams(teams);
        
        const complete = [];
        const details = {};
        
        for (const team of teams) {
          try {
            const roster = await getTeamRoster(team.id);
            const starters = roster.players.filter(p => p.isStarter);
            const hasGoalkeeper = starters.some(p => p.position.toLowerCase() === 'arquero');
            const isComplete = starters.length === 11 && hasGoalkeeper && !!roster.coach;
            
            details[team.id] = {
              isComplete,
              startersCount: starters.length,
              hasGoalkeeper,
              hasCoach: !!roster.coach,
              coachName: roster.coach?.name || 'NINGUNO'
            };
            
            if (isComplete) {
              complete.push(team);
            }
          } catch (error) {
            console.error(`Error checking team ${team.name}:`, error);
            details[team.id] = { error: true };
          }
        }
        
        setCompleteTeams(complete);
        setTeamDetails(details);
      } catch (error) {
        showAlert('error', 'ERROR', 'No se pudieron cargar los equipos');
        console.error('Error loading teams:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTeams();
  }, []);

  const handleTeamSelection = (team, isTeam1) => {
    if (isTeam1) {
      if (selectedTeam2 && team.id === selectedTeam2.id) {
        showAlert('error', 'ERROR', 'No puedes seleccionar el mismo equipo en ambos lados');
        return;
      }
      setSelectedTeam1(team);
    } else {
      if (selectedTeam1 && team.id === selectedTeam1.id) {
        showAlert('error', 'ERROR', 'No puedes seleccionar el mismo equipo en ambos lados');
        return;
      }
      setSelectedTeam2(team);
    }
  };

  const handleSimulate = async () => {
    if (!selectedTeam1 || !selectedTeam2) {
      showAlert('error', 'ERROR', 'Debes seleccionar dos equipos');
      return;
    }

    if (selectedTeam1.id === selectedTeam2.id) {
      showAlert('error', 'ERROR', 'No puedes jugar contra el mismo equipo');
      return;
    }

    setSimulating(true);
    try {
      const result = await simulateMatch(selectedTeam1.id, selectedTeam2.id);
      
      if (!result || !result.stats) {
        throw new Error('El servidor no devolvió los datos correctamente');
      }

      navigation.navigate('MatchDetails', { 
        result: {
          ...result,
          team1Name: selectedTeam1.name,
          team2Name: selectedTeam2.name
        } 
      });
      
    } catch (error) {
      console.error('Error en simulación:', error);
      showAlert('error', 'ERROR', error.message || 'Ocurrió un error al simular el partido');
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.stadiumEffect}>
          <View style={styles.stadiumTop} />
          <View style={styles.centerLine} />
          <View style={styles.stadiumBottom} />
        </View>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>CARGANDO EQUIPOS...</Text>
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>SIMULAR PARTIDO</Text>
        
        <Text style={styles.subtitle}>EQUIPOS COMPLETOS DISPONIBLES: {completeTeams.length}</Text>
        
        {completeTeams.length < 2 && (
          <Text style={styles.warning}>
            NECESITAS AL MENOS 2 EQUIPOS COMPLETOS (11 TITULARES, ARQUERO Y ENTRENADOR) PARA JUGAR
          </Text>
        )}

        {/* Selector de Equipo Local */}
        <View style={styles.teamSelection}>
          <Text style={styles.label}>EQUIPO LOCAL:</Text>
          <View style={styles.selectorContainer}>
            {selectedTeam1 ? (
              <View style={styles.selectedTeamContainer}>
                <Text style={styles.selectedTeamName}>{selectedTeam1.name}</Text>
                <TouchableOpacity 
                  style={styles.changeButton}
                  onPress={() => setSelectedTeam1(null)}
                >
                  <Text style={styles.changeButtonText}>CAMBIAR</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.dropdown}>
                {completeTeams.map(team => (
                  <TouchableOpacity
                    key={`local-${team.id}`}
                    style={styles.teamOption}
                    onPress={() => handleTeamSelection(team, true)}
                  >
                    <Text style={styles.teamOptionText}>{team.name}</Text>
                    <View style={styles.teamBadge}>
                      <Text style={styles.teamBadgeText}>
                        {teamDetails[team.id]?.startersCount || 0}/11
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {selectedTeam1 && teamDetails[selectedTeam1.id] && (
            <View style={styles.teamDetailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>TITULARES:</Text>
                <Text style={styles.detailValue}>{teamDetails[selectedTeam1.id].startersCount}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ARQUERO:</Text>
                <Text style={[
                  styles.detailValue,
                  teamDetails[selectedTeam1.id].hasGoalkeeper ? styles.successText : styles.errorText
                ]}>
                  {teamDetails[selectedTeam1.id].hasGoalkeeper ? 'SÍ' : 'NO'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ENTRENADOR:</Text>
                <Text style={styles.detailValue}>{teamDetails[selectedTeam1.id].coachName}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Selector de Equipo Visitante */}
        <View style={styles.teamSelection}>
          <Text style={styles.label}>EQUIPO VISITANTE:</Text>
          <View style={styles.selectorContainer}>
            {selectedTeam2 ? (
              <View style={styles.selectedTeamContainer}>
                <Text style={styles.selectedTeamName}>{selectedTeam2.name}</Text>
                <TouchableOpacity 
                  style={styles.changeButton}
                  onPress={() => setSelectedTeam2(null)}
                >
                  <Text style={styles.changeButtonText}>CAMBIAR</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.dropdown}>
                {completeTeams.map(team => (
                  <TouchableOpacity
                    key={`visitor-${team.id}`}
                    style={styles.teamOption}
                    onPress={() => handleTeamSelection(team, false)}
                  >
                    <Text style={styles.teamOptionText}>{team.name}</Text>
                    <View style={styles.teamBadge}>
                      <Text style={styles.teamBadgeText}>
                        {teamDetails[team.id]?.startersCount || 0}/11
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {selectedTeam2 && teamDetails[selectedTeam2.id] && (
            <View style={styles.teamDetailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>TITULARES:</Text>
                <Text style={styles.detailValue}>{teamDetails[selectedTeam2.id].startersCount}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ARQUERO:</Text>
                <Text style={[
                  styles.detailValue,
                  teamDetails[selectedTeam2.id].hasGoalkeeper ? styles.successText : styles.errorText
                ]}>
                  {teamDetails[selectedTeam2.id].hasGoalkeeper ? 'SÍ' : 'NO'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ENTRENADOR:</Text>
                <Text style={styles.detailValue}>{teamDetails[selectedTeam2.id].coachName}</Text>
              </View>
            </View>
          )}
        </View>

        <Button
          title={simulating ? 'SIMULANDO...' : 'JUGAR PARTIDO'}
          onPress={handleSimulate}
          disabled={simulating || !selectedTeam1 || !selectedTeam2 || completeTeams.length < 2}
          variant={simulating ? 'secondary' : 'primary'}
          style={styles.button}
        />

        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>INFORMACIÓN DE TODOS LOS EQUIPOS:</Text>
          {allTeams.map(team => (
            <View key={team.id} style={styles.teamDebug}>
              <Text style={styles.teamName}>{team.name.toUpperCase()}</Text>
              {teamDetails[team.id]?.error ? (
                <Text style={styles.debugError}>ERROR AL CARGAR</Text>
              ) : (
                <>
                  <Text style={styles.debugText}>TITULARES: {teamDetails[team.id]?.startersCount || 0}</Text>
                  <Text style={styles.debugText}>ARQUERO: {teamDetails[team.id]?.hasGoalkeeper ? 'SÍ' : 'NO'}</Text>
                  <Text style={styles.debugText}>ENTRENADOR: {teamDetails[team.id]?.coachName || 'NINGUNO'}</Text>
                  <Text style={[
                    styles.debugText,
                    teamDetails[team.id]?.isComplete ? styles.completeText : styles.incompleteText
                  ]}>
                    ESTADO: {teamDetails[team.id]?.isComplete ? 'COMPLETO' : 'INCOMPLETO'}
                  </Text>
                </>
              )}
            </View>
          ))}
        </View>
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
    padding: 20,
    paddingBottom: 40,
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
    fontSize: 22,
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
  subtitle: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  teamSelection: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectorContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 50,
  },
  selectedTeamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  selectedTeamName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  changeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dropdown: {
    maxHeight: 200,
  },
  teamOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  teamOptionText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  teamBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  teamBadgeText: {
    color: '#fff',
    fontSize: 12,
  },
  teamDetailsContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    padding: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  detailValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  successText: {
    color: '#2ecc71',
  },
  errorText: {
    color: '#e74c3c',
  },
  warning: {
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  button: {
    marginTop: 15,
    marginBottom: 30,
  },
  debugSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  teamDebug: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  teamName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  debugText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  debugError: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  completeText: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  incompleteText: {
    color: '#e74c3c',
  },
});

export default PlayMatchScreen;