import React from 'react';
import { Appbar, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Input = (props) => {
  return (
    <TextInput
    style={styles.input}
    {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFF',
    marginBotton: 0,
  },
});
export default Input;
