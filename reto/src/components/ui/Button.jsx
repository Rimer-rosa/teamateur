import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Button = ({ title, onPress, variant = 'primary', icon }) => {
  const getVariantStyle = () => {
    switch(variant) {
      case 'primary': return styles.primary;
      case 'secondary': return styles.secondary;
      case 'accent': return styles.accent;
      default: return styles.primary;
    }
  };
  
  const getIconStyle = () => {
    switch(variant) {
      case 'primary': return styles.iconPrimary;
      case 'secondary': return styles.iconSecondary;
      case 'accent': return styles.iconAccent;
      default: return styles.iconPrimary;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getVariantStyle()]} 
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={[styles.icon, getIconStyle()]} />}
        <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  primary: {
    backgroundColor: '#2e86de',
    borderColor: '#1a73e8',
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  accent: {
    backgroundColor: '#e74c3c',
    borderColor: '#c0392b',
  },
  iconPrimary: {
    backgroundColor: '#1a73e8',
    borderColor: '#fff',
  },
  iconSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#fff',
  },
  iconAccent: {
    backgroundColor: '#c0392b',
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  accentText: {
    color: '#fff',
  },
});

export default Button;