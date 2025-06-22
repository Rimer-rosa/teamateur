import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";
import Button from "../components/ui/Button";

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.stadiumTop}>
        <View style={styles.stadiumSeats} />
      </View>
      <View style={styles.content}>
        <View style={styles.centerCircle} />
        <View style={styles.centerLine} />
        <View style={styles.penaltyArcLeft} />
        <View style={styles.penaltyArcRight} />
        
        <View style={styles.titleContainer}>
          <Text style={styles.welcomeText}>¡BIENVENIDO AL</Text>
          <Text style={styles.title}>TEAMATEUR</Text>
          <View style={styles.titleUnderline} />
          <Text style={styles.subtitle}>Sistema  de gestión futbolística</Text>
        </View>
        
        <View style={styles.buttonGrid}>
          <View style={styles.buttonColumn}>
            <Button 
              title="CREAR EQUIPO" 
              onPress={() => navigation.navigate("CreateTeam")} 
              variant="secondary"
              icon="shield"
            />
            <Button 
              title="FORMAR EQUIPOS" 
              onPress={() => navigation.navigate("Teams")} 
              variant="secondary"
              icon="list"
            />
            <Button 
              title="TOP EQUIPOS" 
              onPress={() => navigation.navigate("TopTeams")} 
              variant="secondary"
              icon="trophy"
            />
          </View>
          
          <View style={styles.buttonColumn}>
            <Button 
              title="CREAR JUGADOR" 
              onPress={() => navigation.navigate("CreatePlayer")} 
              variant="secondary"
              icon="player"
            />
            <Button 
              title="CREAR ENTRENADOR" 
              onPress={() => navigation.navigate("CreateCoach")} 
              variant="secondary"
              icon="coach"
            />
            <Button 
              title="JUGAR PARTIDO" 
              onPress={() => navigation.navigate("PlayMatch")} 
              variant="accent"
              icon="whistle"
            />
          </View>
        </View>
      </View>
      
      {/* Gradas inferiores */}
      <View style={styles.stadiumBottom}>
        <View style={styles.coachingZone}>
          <Text style={styles.coachingText}>ZONA TÉCNICA</Text>
        </View>
      </View>
      
      {/* Detalle de césped */}
      <View style={styles.grassPattern} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a2a',
  },
  stadiumTop: {
    height: 50,
    backgroundColor: '#1e2c3a',
    borderBottomWidth: 10,
    borderBottomColor: '#e74c3c',
    position: 'relative',
    overflow: 'hidden',
  },
  stadiumSeats: {
    position: 'absolute',
    bottom: 5,
    height: 15,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(39, 174, 96, 0.08)',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    transform: [{ translateX: -width * 0.3 }, { translateY: -width * 0.3 }],
  },
  centerLine: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  penaltyArcLeft: {
    position: 'absolute',
    top: '50%',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    transform: [{ translateY: -20 }],
  },
  penaltyArcRight: {
    position: 'absolute',
    top: '50%',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    transform: [{ translateY: -20 }],
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: '#ecf0f1',
    fontSize: 18,
    letterSpacing: 4,
    marginBottom: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  titleUnderline: {
    height: 4,
    width: 100,
    backgroundColor: '#e74c3c',
    marginVertical: 10,
  },
  subtitle: {
    color: '#bdc3c7',
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  buttonColumn: {
    width: '48%',
  },
  stadiumBottom: {
    height: 60,
    backgroundColor: '#1e2c3a',
    borderTopWidth: 10,
    borderTopColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachingZone: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.4)',
  },
  coachingText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  grassPattern: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: 'rgba(39, 174, 96, 0.3)',
    borderTopWidth: 1,
    borderColor: 'rgba(39, 174, 96, 0.5)',
  },
});

export default HomeScreen;