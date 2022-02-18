/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {AppState, Button, StyleSheet, Text, View} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Intent from './Intent';

enableScreens();
const Stack = createNativeStackNavigator();

const Screen2 = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Details</Text>
    </View>
  );
};

const Screen1 = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Button
        title="Next Screen"
        onPress={() => {
          navigation.push('Details');
        }}
      />
    </View>
  );
};

const App = () => {
  useEffect(() => {
    let state = {prev: null};
    const handleAppState = newState => {
      if (newState === 'active' && state.prev !== 'active') {
        Intent.getIntentData().then(str => {
          console.log(str);
        });
      }
      console.log({prev: state.prev, newState});
      state.prev = newState;
    };

    AppState.addEventListener('change', handleAppState);

    return () => {
      AppState.removeEventListener('change', handleAppState);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Screen1} />
        <Stack.Screen name="Details" component={Screen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default App;
