import React from 'react';
import { StyleSheet, View } from 'react-native';

const Body = ({ children }) => {
  return <View styles={styles.container}>{children}</View>;
};


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#fff",
    margin: 0
  }
})



export default Body;
