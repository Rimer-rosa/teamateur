import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomAlert = ({ visible, type, title, message, onClose, onConfirm }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[
        styles.alertContainer,
        type === 'success' ? styles.successAlert : styles.errorAlert
      ]}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        
        <View style={styles.buttonContainer}>
          {onConfirm && (
            <TouchableOpacity 
              style={[styles.alertButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>ACEPTAR</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.alertButton, type === 'error' ? styles.errorButton : styles.closeButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>
              {onConfirm ? 'CANCELAR' : 'CERRAR'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  alertContainer: {
    width: '100%',
    borderRadius: 12,
    padding: 25,
    backgroundColor: '#0a1a2a',
    borderTopWidth: 8,
    elevation: 5,
  },
  successAlert: {
    borderTopColor: '#27ae60',
  },
  errorAlert: {
    borderTopColor: '#e74c3c',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  alertMessage: {
    fontSize: 16,
    color: '#ecf0f1',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  alertButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
  },
  closeButton: {
    backgroundColor: '#2e86de',
  },
  errorButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default CustomAlert;