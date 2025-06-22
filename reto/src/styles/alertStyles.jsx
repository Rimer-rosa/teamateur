// src/styles/alertStyles.js
import { StyleSheet } from 'react-native';

export const alertStyles = StyleSheet.create({
  successContainer: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
    borderRadius: 4,
    padding: 15,
  },
  successTitle: {
    color: '#155724',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successMessage: {
    color: '#155724',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 4,
    padding: 15,
  },
  errorTitle: {
    color: '#721c24',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    color: '#721c24',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  defaultButton: {
    backgroundColor: '#6c757d',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});