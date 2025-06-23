import { Picker as RNPicker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

const Picker = ({
  items,
  selectedValue,
  onValueChange,
  placeholder,
  keyExtractor,
  labelExtractor,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={selectedValue ? styles.text : styles.placeholderText}>
          {selectedValue ? labelExtractor(selectedValue) : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <RNPicker
            selectedValue={selectedValue ? keyExtractor(selectedValue) : null}
            onValueChange={(itemValue) => {
              const selected = items.find(item => keyExtractor(item) === itemValue);
              onValueChange(selected);
              setModalVisible(false);
            }}
            style={styles.picker}
          >
            <RNPicker.Item label={placeholder} value={null} />
            {items.map((item) => (
              <RNPicker.Item
                key={keyExtractor(item)}
                label={labelExtractor(item)}
                value={keyExtractor(item)}
              />
            ))}
          </RNPicker>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
  },
  picker: {
    width: '100%',
  },
});

export default Picker;