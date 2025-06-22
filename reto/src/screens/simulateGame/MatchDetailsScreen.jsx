import { ScrollView, StyleSheet, Text, View } from 'react-native';

const MatchDetailsScreen = ({ route }) => {
  const { result } = route.params || {};
  const safeResult = {
    winner: {
      name: result?.winner?.name || 'EQUIPO DESCONOCIDO',
      coach: { name: result?.winner?.coach?.name || 'NINGUNO' },
      startersCount: result?.winner?.startersCount || 0,
      hasGoalkeeper: result?.winner?.hasGoalkeeper || false,
      strength: result?.winner?.strength || 0
    },
    loser: {
      name: result?.loser?.name || 'EQUIPO DESCONOCIDO',
      coach: { name: result?.loser?.coach?.name || 'NINGUNO' },
      startersCount: result?.loser?.startersCount || 0,
      hasGoalkeeper: result?.loser?.hasGoalkeeper || false,
      strength: result?.loser?.strength || 0
    },
    stats: {
      team1: {
        possession: result?.stats?.team1?.possession || 50,
        shots: result?.stats?.team1?.shots || 0,
        shotsOnTarget: result?.stats?.team1?.shotsOnTarget || 0,
        corners: result?.stats?.team1?.corners || 0,
        fouls: result?.stats?.team1?.fouls || 0,
        yellowCards: result?.stats?.team1?.yellowCards || 0,
        redCards: result?.stats?.team1?.redCards || 0
      },
      team2: {
        possession: result?.stats?.team2?.possession || 50,
        shots: result?.stats?.team2?.shots || 0,
        shotsOnTarget: result?.stats?.team2?.shotsOnTarget || 0,
        corners: result?.stats?.team2?.corners || 0,
        fouls: result?.stats?.team2?.fouls || 0,
        yellowCards: result?.stats?.team2?.yellowCards || 0,
        redCards: result?.stats?.team2?.redCards || 0
      }
    },
    date: result?.date || new Date().toISOString()
  };

  // Calcular porcentaje de fuerza relativa
  const totalStrength = safeResult.winner.strength + safeResult.loser.strength;
  const winnerStrengthPercent = totalStrength > 0 
    ? Math.round((safeResult.winner.strength / totalStrength) * 100) 
    : 50;
  const loserStrengthPercent = 100 - winnerStrengthPercent;

  return (
    <View style={styles.container}>
      <View style={styles.stadiumEffect}>
        <View style={styles.stadiumTop} />
        <View style={styles.centerLine} />
        <View style={styles.stadiumBottom} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>DETALLES DEL PARTIDO</Text>
        
        {/* Resultado principal */}
        <View style={styles.resultContainer}>
          <Text style={styles.winnerText}>{safeResult.winner.name}</Text>
          <Text style={styles.vsText}>VS</Text>
          <Text style={styles.loserText}>{safeResult.loser.name}</Text>
        </View>
        
        {/* Indicador de ganador */}
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerLabel}>GANADOR: {safeResult.winner.name}</Text>
          <Text style={styles.strengthText}>
            FUERZA RELATIVA: {winnerStrengthPercent}% - {loserStrengthPercent}%
          </Text>
        </View>
        
        {/* Barra de fuerza relativa */}
        <View style={styles.strengthBarContainer}>
          <View style={[styles.strengthBarWinner, {flex: winnerStrengthPercent}]} />
          <View style={[styles.strengthBarLoser, {flex: loserStrengthPercent}]} />
        </View>
        <View style={styles.strengthLabels}>
          <Text style={styles.strengthLabel}>{winnerStrengthPercent}%</Text>
          <Text style={styles.strengthLabel}>{loserStrengthPercent}%</Text>
        </View>
        
        {/* Estadísticas del partido */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>ESTADÍSTICAS DEL PARTIDO</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>POSESIÓN:</Text>
            <Text style={styles.statValue}>
              {safeResult.stats.team1.possession}% - {safeResult.stats.team2.possession}%
            </Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>REMATES TOTALES:</Text>
            <Text style={styles.statValue}>
              {safeResult.stats.team1.shots} - {safeResult.stats.team2.shots}
            </Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>REMATES AL ARCO:</Text>
            <Text style={styles.statValue}>
              {safeResult.stats.team1.shotsOnTarget} - {safeResult.stats.team2.shotsOnTarget}
            </Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>TIROS DE ESQUINA:</Text>
            <Text style={styles.statValue}>
              {safeResult.stats.team1.corners} - {safeResult.stats.team2.corners}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>FALTAS:</Text>
            <Text style={styles.statValue}>
              {safeResult.stats.team1.fouls} - {safeResult.stats.team2.fouls}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>TARJETAS AMARILLAS:</Text>
            <Text style={styles.statValue}>
              {safeResult.stats.team1.yellowCards} - {safeResult.stats.team2.yellowCards}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>TARJETAS ROJAS:</Text>
            <Text style={styles.statValue}>
              {safeResult.stats.team1.redCards} - {safeResult.stats.team2.redCards}
            </Text>
          </View>
        </View>
        
        {/* Información de los equipos */}
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>EQUIPO GANADOR</Text>
          <View style={styles.teamDetailRow}>
            <Text style={styles.teamDetailLabel}>ENTRENADOR:</Text>
            <Text style={styles.teamDetailValue}>{safeResult.winner.coach.name}</Text>
          </View>
          <View style={styles.teamDetailRow}>
            <Text style={styles.teamDetailLabel}>TITULARES:</Text>
            <Text style={styles.teamDetailValue}>{safeResult.winner.startersCount}/11</Text>
          </View>
          <View style={styles.teamDetailRow}>
            <Text style={styles.teamDetailLabel}>ARQUERO:</Text>
            <Text style={[
              styles.teamDetailValue,
              safeResult.winner.hasGoalkeeper ? styles.successText : styles.errorText
            ]}>
              {safeResult.winner.hasGoalkeeper ? 'SÍ' : 'NO'}
            </Text>
          </View>
        </View>
        
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>EQUIPO PERDEDOR</Text>
          <View style={styles.teamDetailRow}>
            <Text style={styles.teamDetailLabel}>ENTRENADOR:</Text>
            <Text style={styles.teamDetailValue}>{safeResult.loser.coach.name}</Text>
          </View>
          <View style={styles.teamDetailRow}>
            <Text style={styles.teamDetailLabel}>TITULARES:</Text>
            <Text style={styles.teamDetailValue}>{safeResult.loser.startersCount}/11</Text>
          </View>
          <View style={styles.teamDetailRow}>
            <Text style={styles.teamDetailLabel}>ARQUERO:</Text>
            <Text style={[
              styles.teamDetailValue,
              safeResult.loser.hasGoalkeeper ? styles.successText : styles.errorText
            ]}>
              {safeResult.loser.hasGoalkeeper ? 'SÍ' : 'NO'}
            </Text>
          </View>
        </View>
        
        {/* Fecha del partido */}
        <Text style={styles.dateText}>
          PARTIDO SIMULADO EL: {new Date(safeResult.date).toLocaleDateString()}
        </Text>
      </ScrollView>
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
  resultContainer: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  winnerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  vsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginVertical: 5,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loserText: {
    fontSize: 18,
    color: '#e74c3c',
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  winnerContainer: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  winnerLabel: {
    color: '#2ecc71',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  strengthText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  strengthBarContainer: {
    flexDirection: 'row',
    height: 10,
    marginBottom: 5,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  strengthBarWinner: {
    backgroundColor: '#2ecc71',
  },
  strengthBarLoser: {
    backgroundColor: '#e74c3c',
  },
  strengthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  strengthLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  statsContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  teamSection: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  teamDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teamDetailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  teamDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  successText: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});

export default MatchDetailsScreen;